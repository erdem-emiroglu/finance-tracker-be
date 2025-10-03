import {
  JWTPayload,
  RefreshJWTPayload,
  SupabaseUserSelect,
} from '@interfaces/supabase.interface';
import {
  BadRequestException,
  ConflictException,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { SupabaseService } from '@supabase/supabase.service';
import * as bcrypt from 'bcryptjs';
import {
  AuthResponseDto,
  RefreshTokenDto,
  SignInDto,
  SignUpDto,
} from './dto/auth.dto';

@Injectable()
export class AuthService {
  private readonly saltRounds = 12;
  private readonly accessTokenExpiresIn = '15m';
  private readonly refreshTokenExpiresIn = '7d';

  constructor(
    private readonly jwtService: JwtService,
    private readonly supabaseService: SupabaseService,
  ) {}

  async signUp(signUpDto: SignUpDto): Promise<AuthResponseDto> {
    const { email, password, firstName, lastName } = signUpDto;

    try {
      const hashedPassword = await bcrypt.hash(password, this.saltRounds);

      const { data: existingUser, error: existingError } =
        await this.supabaseService
          .getClient()
          .from('users')
          .select('id')
          .eq('email', email)
          .single();

      if (existingUser && !existingError) {
        throw new ConflictException('User with this email already exists');
      }

      const { data: newUser, error: insertError } = await this.supabaseService
        .getClient()
        .from('users')
        .insert([
          {
            email,
            password: hashedPassword,
            first_name: firstName,
            last_name: lastName,
            created_at: new Date().toISOString(),
            updated_at: new Date().toISOString(),
          },
        ])
        .select('id, email, first_name, last_name')
        .single();

      if (insertError) {
        console.error('Signup error:', insertError);
        throw new BadRequestException(
          `Failed to create user: ${insertError.message}`,
        );
      }

      const payload: JWTPayload = {
        sub: newUser.id,
        email: newUser.email,
        firstName: newUser.first_name,
        lastName: newUser.last_name,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.accessTokenExpiresIn,
      });

      const refreshPayload: Omit<RefreshJWTPayload, 'iat' | 'exp'> = {
        sub: newUser.id,
        type: 'refresh',
      };

      const refreshToken = this.jwtService.sign(refreshPayload, {
        expiresIn: this.refreshTokenExpiresIn,
      });

      await this.storeRefreshToken(newUser.id, refreshToken);

      return {
        accessToken,
        refreshToken,
        user: {
          id: newUser.id,
          email: newUser.email,
          firstName: newUser.first_name,
          lastName: newUser.last_name,
        },
      };
    } catch (error) {
      if (
        error instanceof ConflictException ||
        error instanceof BadRequestException
      ) {
        throw error;
      }
      throw new BadRequestException('Sign up failed');
    }
  }

  async signIn(signInDto: SignInDto): Promise<AuthResponseDto> {
    const { email, password } = signInDto;

    try {
      const { data: user, error } = await this.supabaseService
        .getClient()
        .from('users')
        .select('id, email, password, first_name, last_name')
        .eq('email', email)
        .single();

      if (error || !user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isPasswordValid = await bcrypt.compare(password, user.password);
      if (!isPasswordValid) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.accessTokenExpiresIn,
      });

      const refreshToken = this.jwtService.sign(
        { sub: user.id, type: 'refresh' },
        {
          expiresIn: this.refreshTokenExpiresIn,
        },
      );

      await this.storeRefreshToken(user.id, refreshToken);

      return {
        accessToken,
        refreshToken,
        user: {
          id: user.id,
          email: user.email,
          firstName: user.first_name,
          lastName: user.last_name,
        },
      };
    } catch (error) {
      if (error instanceof UnauthorizedException) {
        throw error;
      }
      throw new UnauthorizedException('Sign in failed');
    }
  }

  async refreshTokens(
    refreshTokenDto: RefreshTokenDto,
  ): Promise<{ access: string; refreshToken: string }> {
    const { refreshToken } = refreshTokenDto;

    try {
      const decoded = this.jwtService.verify(refreshToken);

      if (decoded.type !== 'refresh') {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const isValidToken = await this.validateRefreshToken(
        decoded.sub,
        refreshToken,
      );
      if (!isValidToken) {
        throw new UnauthorizedException('Invalid refresh token');
      }

      const { data: user, error } = await this.supabaseService
        .getClient()
        .from('users')
        .select('id, email, first_name, last_name')
        .eq('id', decoded.sub)
        .single();

      if (error || !user) {
        throw new UnauthorizedException('User not found');
      }

      const payload = {
        sub: user.id,
        email: user.email,
        firstName: user.first_name,
        lastName: user.last_name,
      };

      const accessToken = this.jwtService.sign(payload, {
        expiresIn: this.accessTokenExpiresIn,
      });

      const newRefreshToken = this.jwtService.sign(
        { sub: user.id, type: 'refresh' },
        {
          expiresIn: this.refreshTokenExpiresIn,
        },
      );

      await this.storeRefreshToken(user.id, newRefreshToken);
      await this.revokeRefreshToken(refreshToken);

      return {
        access: accessToken,
        refreshToken: newRefreshToken,
      };
    } catch {
      throw new UnauthorizedException('Token refresh failed');
    }
  }

  async logout(refreshToken: string): Promise<void> {
    try {
      await this.revokeRefreshToken(refreshToken);
    } catch {
      throw new UnauthorizedException('Logout failed');
    }
  }

  private async storeRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<void> {
    const hashedToken = await bcrypt.hash(refreshToken, 8);

    await this.supabaseService
      .getClient()
      .from('refresh_tokens')
      .upsert([
        {
          user_id: userId,
          token_hash: hashedToken,
          expires_at: new Date(
            Date.now() + 7 * 24 * 60 * 60 * 1000,
          ).toISOString(),
          created_at: new Date().toISOString(),
        },
      ]);
  }

  private async validateRefreshToken(
    userId: string,
    refreshToken: string,
  ): Promise<boolean> {
    const { data: tokenRecord, error } = await this.supabaseService
      .getClient()
      .from('refresh_tokens')
      .select('token_hash, expires_at')
      .eq('user_id', userId)
      .gte('expires_at', new Date().toISOString())
      .single();

    if (error || !tokenRecord) {
      return false;
    }

    const isValid = await bcrypt.compare(refreshToken, tokenRecord.token_hash);
    return isValid;
  }

  private async revokeRefreshToken(refreshToken: string): Promise<void> {
    const decoded = this.jwtService.verify(refreshToken);
    const hashedToken = await bcrypt.hash(refreshToken, 8);

    await this.supabaseService
      .getClient()
      .from('refresh_tokens')
      .delete()
      .eq('user_id', decoded.sub)
      .eq('token_hash', hashedToken);
  }

  async validateUser(payload: JWTPayload): Promise<SupabaseUserSelect | null> {
    const { data: user, error } = await this.supabaseService
      .getClient()
      .from('users')
      .select('id, email, first_name, last_name')
      .eq('id', payload.sub)
      .single();

    if (error || !user) {
      return null;
    }

    return user;
  }
}
