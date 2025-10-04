import { REGEX_PATTERNS, REGEX_VALIDATION_MESSAGES } from '@constants/regex';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import {
  IsEmail,
  IsString,
  Matches,
  MaxLength,
  MinLength,
} from 'class-validator';

export class SignUpDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: REGEX_VALIDATION_MESSAGES.EMAIL.STANDARD })
  email: string;

  @ApiProperty({
    description: 'User password - must be strong with mixed characters',
    example: 'SecurePass123!',
    minLength: 12,
    maxLength: 128,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(12, { message: 'Password must be at least 12 characters long' })
  @MaxLength(128, { message: 'Password must not exceed 128 characters' })
  @Matches(REGEX_PATTERNS.PASSWORD.STRONG, {
    message: REGEX_VALIDATION_MESSAGES.PASSWORD.STRONG,
  })
  password: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'First name must be a string' })
  @MinLength(2, { message: REGEX_VALIDATION_MESSAGES.NAME.TOO_SHORT })
  @MaxLength(50, { message: REGEX_VALIDATION_MESSAGES.NAME.TOO_LONG })
  @Matches(REGEX_PATTERNS.NAME.TURKISH_NAME, {
    message: REGEX_VALIDATION_MESSAGES.NAME.TURKISH_NAME,
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
    minLength: 2,
    maxLength: 50,
  })
  @IsString({ message: 'Last name must be a string' })
  @MinLength(2, { message: REGEX_VALIDATION_MESSAGES.NAME.TOO_SHORT })
  @MaxLength(50, { message: REGEX_VALIDATION_MESSAGES.NAME.TOO_LONG })
  @Matches(REGEX_PATTERNS.NAME.TURKISH_NAME, {
    message: REGEX_VALIDATION_MESSAGES.NAME.TURKISH_NAME,
  })
  lastName: string;
}

export class SignInDto {
  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
    format: 'email',
  })
  @IsEmail({}, { message: REGEX_VALIDATION_MESSAGES.EMAIL.STANDARD })
  email: string;

  @ApiProperty({
    description: 'User password',
    example: 'SecurePass123!',
    minLength: 1,
  })
  @IsString({ message: 'Password must be a string' })
  @MinLength(1, { message: 'Password is required' })
  password: string;
}

export class RefreshTokenDto {
  @ApiProperty({
    description: 'Refresh token received from login/signup',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  @IsString({ message: 'Refresh token must be a string' })
  refreshToken: string;
}

export class AuthUserDto {
  @ApiProperty({
    description: 'User unique identifier',
    example: '550e8400-e29b-41d4-a716-446655440000',
  })
  id: string;

  @ApiProperty({
    description: 'User email address',
    example: 'john.doe@example.com',
  })
  email: string;

  @ApiProperty({
    description: 'User first name',
    example: 'John',
  })
  firstName: string;

  @ApiProperty({
    description: 'User last name',
    example: 'Doe',
  })
  lastName: string;
}

export class AuthResponseDto {
  @ApiProperty({
    description: 'JWT access token - short-lived (15 minutes)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  accessToken: string;

  @ApiProperty({
    description: 'JWT refresh token - long-lived (7 days)',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;

  @ApiProperty({
    description: 'User information',
    type: AuthUserDto,
  })
  user: AuthUserDto;
}

export class RefreshResponseDto {
  @ApiProperty({
    description: 'New JWT access token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  access: string;

  @ApiProperty({
    description: 'New JWT refresh token',
    example: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...',
  })
  refreshToken: string;
}

export class ErrorResponseDto {
  @ApiProperty({
    description: 'Error message',
    example: 'Validation failed',
  })
  message: string;

  @ApiPropertyOptional({
    description: 'Error code',
    example: 'VALIDATION_ERROR',
  })
  error?: string;

  @ApiPropertyOptional({
    description: 'HTTP status code',
    example: 400,
  })
  statusCode?: number;

  @ApiPropertyOptional({
    description: 'Additional error details',
    example: ['email must be a valid email'],
  })
  details?: string[];
}
