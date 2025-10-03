# Authentication System Documentation

## Overview

This finance tracker application implements a modern, secure authentication system using JWT tokens with the following security features:

- **Strong Password Requirements**: Minimum 12 characters with mixed case, numbers, and special characters
- **JWT Access Tokens**: Short-lived (15 minutes) for security
- **Refresh Tokens**: Long-lived (7 days) with secure storage and rotation
- **Rate Limiting**: Protection against brute force attacks
- **Input Validation**: Comprehensive data validation and sanitization
- **Password Hashing**: bcrypt with salt rounds of 12
- **Security Headers**: Helmet.js for enhanced security

## API Endpoints

### Authentication Routes

All authentication endpoints are prefixed with `/auth`.

#### 1. Sign Up
**POST** `/auth/signup`

Creates a new user account with strong validation.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!",
  "firstName": "John",
  "lastName": "Doe"
}
```

**Password Requirements:**
- Minimum 12 characters
- At least one uppercase letter
- At least one lowercase letter  
- At least one number
- At least one special character (@$!%*?&)

**Response:**
```json
{
  "accessToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9...",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

#### 2. Sign In
**POST** `/auth/signin`

Authenticates existing user and returns tokens.

**Request Body:**
```json
{
  "email": "user@example.com",
  "password": "SecurePass123!"
}
```

**Response:** Same as signup response.

#### 3. Refresh Tokens
**POST** `/auth/refresh`

Refreshes expired access token using refresh token.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```json
{
  "access": "new-access-token",
  "refreshToken": "new-refresh-token"
}
```

#### 4. Logout
**POST** `/auth/logout`

Invalidates refresh token for secure logout.

**Request Body:**
```json
{
  "refreshToken": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

**Response:**
```
"Logged out successfully"
```

## Protected Routes

### Profile Access
**GET** `/profile`

Access user profile information. Requires valid access token in Authorization header.

**Headers:**
```
Authorization: Bearer <access-token>
```

**Response:**
```json
{
  "message": "This is a protected route",
  "user": {
    "id": "uuid",
    "email": "user@example.com",
    "firstName": "John",
    "lastName": "Doe"
  }
}
```

## Security Features

### 1. Rate Limiting
- Auth endpoints: 5 requests per minute per IP
- General endpoints: 10 requests per minute per IP
- Protects against brute force attacks

### 2. JWT Security
- Access tokens expire in 15 minutes
- Refresh tokens expire in 7 days
- Tokens are signed with a secret key (configure in .env)
- Refresh tokens are hashed before database storage

### 3. Password Security
- bcrypt hashing with salt rounds of 12
- Strong password requirements
- Passwords are never logged or returned

### 4. Input Validation
- All inputs are validated and sanitized
- Non-whitelisted properties are rejected
- Type conversion handles data properly

### 5. Security Headers
- Helmet.js provides comprehensive security headers
- Content Security Policy (CSP)
- HTTP Strict Transport Security (HSTS)
- Cross-origin protection

## Database Schema

### Users Table
```sql
CREATE TABLE users (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    first_name VARCHAR(100) NOT NULL,
    last_name VARCHAR(100) NOT NULL,
    email_verified BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);
```

### Refresh Tokens Table
```sql
CREATE TABLE refresh_tokens (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    user_id UUID NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    token_hash VARCHAR(255) NOT NULL,
    expires_at TIMESTAMP WITH TIME ZONE NOT NULL,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
    UNIQUE(token_hash)
);
```

## Environment Variables

Required environment variables in `.env`:

```env
SUPABASE_URL=https://your-supabase-url
SUPABASE_ANON_KEY=your-supabase-anon-key
JWT_SECRET=your-super-secret-jwt-key-minimum-32-characters
JWT_EXPIRES_IN=15m
JWT_REFRESH_EXPIRES_IN=7d
```

**Important:** Generate a strong, random JWT_SECRET of at least 32 characters for production.

## Usage Examples

### Frontend Integration

```javascript
// Sign up
const response = await fetch('/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify({
    email: 'user@example.com',
    password: 'SecurePass123!',
    firstName: 'John',
    lastName: 'Doe'
  })
});

const { accessToken, refreshToken, user } = await response.json();

// Store tokens securely (consider httpOnly cookies for production)
localStorage.setItem('accessToken', accessToken);
localStorage.setItem('refreshToken', refreshToken);

// Access protected route
const profileResponse = await fetch('/profile', {
  headers: {
    'Authorization': `Bearer ${accessToken}`
  }
});
const profileData = await profileResponse.json();
```

### Token Refresh Flow

```javascript
async function refreshAccessToken() {
  try {
    const oldRefreshToken = localStorage.getItem('refreshToken');
    const response = await fetch('/auth/refresh', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        refreshToken: oldRefreshToken
      })
    });

    if (response.ok) {
      const { access, refreshToken } = await response.json();
      localStorage.setItem('accessToken', access);
      localStorage.setItem('refreshToken', refreshToken);
      return access;
    } else {
      // Redirect to login
      throw new Error('Token refresh failed');
    }
  } catch (error) {
    // Handle logout
    localStorage.removeItem('accessToken');
    localStorage.removeItem('refreshToken');
    window.location.href = '/login';
  }
}
```

## Testing

### Test Authentication Flow

1. **Start the server:**
   ```bash
   npm run start:dev
   ```

2. **Test signup:**
   ```bash
   curl -X POST http://localhost:3000/auth/signup \
     -H "Content-Type: application/json" \
     -d '{"email":"test@example.com","password":"SecurePass123!","firstName":"Test","lastName":"User"}'
   ```

3. **Test protected route:**
   ```bash
   curl -X GET http://localhost:3000/profile \
     -H "Authorization: Bearer YOUR_ACCESS_TOKEN"
   ```

## Production Considerations

1. **Environment Security:**
   - Use strong, randomly generated JWT secrets
   - Rotate secrets regularly
   - Use environment-specific databases

2. **Token Security:**
   - Consider shorter access token lifetimes
   - Implement token blacklisting for logout
   - Use HTTP-only cookies for token storage

3. **Additional Security:**
   - Implement email verification
   - Add two-factor authentication
   - Monitor failed login attempts
   - Implement account lockout policies

4. **Scalability:**
   - Use Redis for token storage
   - Implement proper session management
   - Add API versioning
   - Monitor authentication metrics

## Troubleshooting

### Common Issues

1. **JWT_SECRET not defined:**
   - Ensure JWT_SECRET is set in .env file
   - Secret length must be at least 32 characters

2. **Invalid credentials:**
   - Check email format validation
   - Verify password meets requirements
   - Ensure user exists in database

3. **Token expired:**
   - Implement automatic token refresh
   - Handle 401 responses gracefully
   - Redirect to login when refresh fails

4. **Rate limiting:**
   - Check IP-based rate limits
   - Implement exponential backoff
   - Consider authenticated user limits

