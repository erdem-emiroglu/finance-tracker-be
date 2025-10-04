import { Controller, Get, UseGuards, Request } from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiUnauthorizedResponse,
} from '@nestjs/swagger';
import { AppService } from './app.service';
import { JwtAuthGuard } from '@auth/guards/jwt-auth.guard';
import { ErrorResponseDto, AuthUserDto } from '@auth/dto/auth.dto';

@Controller()
export class AppController {
  constructor(private readonly appService: AppService) {}

  @Get()
  @ApiTags('General')
  @ApiOperation({
    summary: 'Welcome endpoint',
    description: 'Simple welcome message for the Finance Tracker API',
  })
  @ApiResponse({
    status: 200,
    description: 'Welcome message',
    schema: {
      type: 'string',
      example: 'Finance Tracker API is running!',
    },
  })
  getHello(): string {
    return this.appService.getHello();
  }

  @Get('profile')
  @UseGuards(JwtAuthGuard)
  @ApiTags('User')
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
