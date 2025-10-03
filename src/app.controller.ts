import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { SupabaseService } from '@supabase/supabase.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import {
  HealthCheckDto,
  ErrorResponseDto,
  AuthUserDto,
} from '@auth/dto/auth.dto';

@Controller()
export class AppController {
  constructor(
    private readonly appService: AppService,
    private readonly supabaseService: SupabaseService,
  ) {}

  @Get()
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('health')
  @ApiTags('Health')
  @ApiOperation({
    summary: 'Health check endpoint',
    description:
      'Check the health status of the application and database connection',
  })
  @ApiResponse({
    status: 200,
    description: 'Health check successful',
    type: HealthCheckDto,
  })
  async healthCheck() {
    try {
      const { error } = await this.supabaseService
        .getClient()
        .from('health_check')
        .select('*')
        .limit(1);

      return {
        status: 'ok',
        supabase: error ? 'disconnected' : 'connected',
        timestamp: new Date().toISOString(),
      };
    } catch {
      return {
        status: 'error',
        supabase: 'disconnected',
        timestamp: new Date().toISOString(),
      };
    }
  }

  @Get('supabase-test')
  async testSupabase() {
    try {
      const { data, error } = await this.supabaseService
        .getClient()
        .auth.getUser();

      return {
        success: true,
        auth: !!data?.user,
        error: error?.message,
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error',
      };
    }
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiTags('Protected')
  @ApiBearerAuth('JWT-auth')
  @ApiOperation({
    summary: 'Get user profile',
    description:
      'Access user profile information. This is a protected route requiring valid JWT token.',
  })
  @ApiResponse({
    status: 200,
    description: 'User profile retrieved successfully',
    schema: {
      type: 'object',
      properties: {
        message: {
          type: 'string',
          example: 'This is a protected route',
        },
        user: {
          type: 'object',
          $ref: '#/components/schemas/AuthUserDto',
        },
      },
    },
  })
  @ApiUnauthorizedResponse({
    description: 'Invalid or missing JWT token',
    type: ErrorResponseDto,
  })
  getProfile(@Request() req: { user: AuthUserDto }) {
    return {
      message: 'This is a protected route',
      user: req.user,
    };
  }
}
