import {
  Controller,
  Post,
  Body,
  UseGuards,
  HttpCode,
  HttpStatus,
  UsePipes,
  ValidationPipe,
  Request,
} from '@nestjs/common';
import { ThrottlerGuard } from '@nestjs/throttler';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBody,
  ApiBadRequestResponse,
  ApiUnauthorizedResponse,
  ApiConflictResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';
import { AuthService } from './auth.service';
import {
  SignUpDto,
  SignInDto,
  RefreshTokenDto,
  AuthResponseDto,
  RefreshResponseDto,
  ErrorResponseDto,
} from './dto/auth.dto';

@ApiTags('Authentication')
@Controller('auth')
@UseGuards(ThrottlerGuard)
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('signup')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({
    summary: 'Create a new user account',
    description:
      'Register a new user with strong password requirements and email validation',
  })
  @ApiCreatedResponse({
    description: 'User successfully created',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid input',
    type: ErrorResponseDto,
  })
  @ApiConflictResponse({
    description: 'User with email already exists',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: SignUpDto })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async signUp(@Body() signUpDto: SignUpDto): Promise<AuthResponseDto> {
    return this.authService.signUp(signUpDto);
  }

  @Post('signin')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User login',
    description:
      'Authenticate user with email and password to receive JWT tokens',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully authenticated',
    type: AuthResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid input',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid credentials',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: SignInDto })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async signIn(@Body() signInDto: SignInDto): Promise<AuthResponseDto> {
    return this.authService.signIn(signInDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'Refresh access token',
    description:
      'Generate new access token using valid refresh token. Provides token rotation for enhanced security.',
  })
  @ApiResponse({
    status: 200,
    description: 'Tokens successfully refreshed',
    type: RefreshResponseDto,
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid token',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or expired refresh token',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: RefreshTokenDto })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async refresh(@Body() refreshTokenDto: RefreshTokenDto) {
    return this.authService.refreshTokens(refreshTokenDto);
  }

  @Post('logout')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({
    summary: 'User logout',
    description:
      'Securely invalidate refresh token to log out user. Token rotation ensures old tokens are unusable.',
  })
  @ApiResponse({
    status: 200,
    description: 'User successfully logged out',
    schema: {
      type: 'string',
      example: 'Logged out successfully',
    },
  })
  @ApiBadRequestResponse({
    description: 'Validation failed or invalid token',
    type: ErrorResponseDto,
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid refresh token',
    type: ErrorResponseDto,
  })
  @ApiBody({ type: RefreshTokenDto })
  @UsePipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  )
  async logout(@Body() body: RefreshTokenDto): Promise<string> {
    await this.authService.logout(body.refreshToken);
    return 'Logged out successfully';
  }
}
