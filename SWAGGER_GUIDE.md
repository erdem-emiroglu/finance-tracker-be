# 🚀 Finance Tracker API - Swagger Documentation

Bu dokümantasyon Finance Tracker authentication sistemi için hazırlanmış kapsamlı Swagger API dokümantasyonunu açıklar.

## 📍 Swagger UI Erişim

Swagger UI'ya şu adreslerden erişebilirsiniz:

### Development
- **URL**: `http://localhost:3000/api/docs`
- **Açıklama**: Development sunucusunda çalışan Swagger UI

### Production
- **URL**: `https://api.yourdomain.com/api/docs`
- **Açıklama**: Production sunucusunda çalışan Swagger UI

## 🔧 Swagger Özellikleri

### ✅ Konfigürasyon Özellikleri

- **Title**: Finance Tracker API
- **Version**: 1.0
- **Description**: Comprehensive authentication system with modern security features
- **Servers**: Development ve Production sunucuları
- **Tags**: Authentication, Protected, Health

### 🔐 Güvenlik Özellikleri

- **Bearer Token (JWT)**: OAuth 2.0 standardında token-based authentication
- **Scheme**: Bearer
- **Format**: JWT
- **Authorization Header**: Otomatik header injection
- **Persistent Authorization**: Token'lar session boyunca saklanır

### 📋 API Endpoint'leri

#### Authentication Endpoints (`/auth`)

| Method | Endpoint | Tag | Description |
|--------|----------|-----|-------------|
| POST | `/auth/signup` | Authentication | Kullanıcı kaydı |
| POST | `/auth/signin` | Authentication | Kullanıcı girişi |
| POST | `/auth/refresh` | Authentication | Token yenileme |
| POST | `/auth/logout` | Authentication | Güvenli çıkış |

#### Protected Endpoints

| Method | Endpoint | Tag | Protection |
|--------|----------|-----|------------|
| GET | `/profile` | Protected | JWT Bearer Token |
| GET | `/health` | Health | Public |

#### Public Endpoints

| Method | Endpoint | Tag | Description |
|--------|----------|-----|-------------|
| GET | `/health` | Health | Sistem sağlık kontrolü |
| GET | `/supabase-test` | Health | Database bağlantı testi |

## 🎯 Swagger UI Özellikleri

### 📊 Gelişmiş UI Özellikleri

1. **Request Duration**: İstek sürelerini gösterir
2. **Request Headers**: Header'ları otomatik gösterir
3. **Common Extensions**: Yaygın extension'ları gösterir
4. **Persistent Authorization**: Token'lar oturum boyunca saklanır
5. **Interactive Testing**: Doğrudan browser'dan test edilebilir

### 🔧 Özelleştirmeler

- **Custom Site Title**: "Finance Tracker API Documentation"
- **Custom Favicon**: `/favicon.ico`
- **Modern UI**: Swagger UI 4.15.5
- **Responsive Design**: Mobil uyumlu

## 📝 API Dokümantasyon Yapısı

### 🔸 Schema Definitions

#### DTO Classes

```typescript
// Request DTOs
SignUpDto           // Kullanıcı kaydı
SignInDto           // Kullanıcı girişi
RefreshTokenDto     // Token yenileme

// Response DTOs
AuthResponseDto     // Authentication response
RefreshResponseDto  // Refresh response
ErrorResponseDto    // Error response
HealthCheckDto      // Health check response
AuthUserDto         // User information
```

### 🔸 Validation Details

#### SignUpDto Validation

```typescript
{
  "email": {
    "type": "string",
    "format": "email",
    "example": "john.doe@example.com"
  },
  "password": {
    "type": "string",
    "minLength": 12,
    "maxLength": 128,
    "pattern": "Strong password regex",
    "example": "SecurePass123!"
  },
  "firstName": {
    "type": "string",
    "minLength": 2,
    "maxLength": 50,
    "pattern": "Turkish character support",
    "example": "John"
  },
  "lastName": {
    "type": "string",
    "minLength": 2,
    "maxLength": 50,
    "pattern": "Turkish character support",
    "example": "Doe"
  }
}
```

#### Security Requirements

```typescript
{
  "JWT-auth": {
    "type": "http",
    "scheme": "bearer",
    "bearerFormat": "JWT"
  }
}
```

## 🚀 Kullanım Örnekleri

### 1. API Testing

#### Manuel Testing
1. `http://localhost:3000/api/docs` adresine git
2. Endpoint'e tıkla
3. "Try it out" butonuna bas
4. Parametreleri doldur
5. "Execute" butonuna bas

#### Authentication Flow Testing

```json
// 1. Sign Up
POST /auth/signup
{
  "email": "test@example.com",
  "password": "SecurePass123!",
  "firstName": "Test",
  "lastName": "User"
}

// 2. Copy refresh token from response

// 3. Test Protected Route
GET /profile
Authorization: Bearer <accessToken>
```

### 2. Integration Testing

#### Frontend Integration

```javascript
// Swagger'ın önerdiği pattern'ları kullan
const response = await fetch('/auth/signup', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
  },
  body: JSON.stringify(signUpData)
});

const { accessToken, refreshToken, user } = await response.json();
```

## 📊 Development Süreci

### 🔍 Swagger Oluşturma Süreci

1. **Controller Decoration**: `@ApiTags`, `@ApiOperation`, `@ApiResponse`
2. **DTO Modelling**: Request/Response tipleri
3. **Schema Generation**: Otomatik OpenAPI schema üretimi
4. **UI Generation**: Interactive Swagger UI oluşturulması

### 🔧 Maintenance

#### Regex Centralization

Tüm regex kalıpları `src/constants/regex.ts` dosyasında merkezi olarak yönetiliyor:

```typescript
// Regex kalıpları
REGEX_PATTERNS.PASSWORD.STRONG
REGEX_PATTERNS.NAME.TURKISH_NAME
REGEX_PATTERNS.EMAIL.STANDARD

// Validation mesajları
REGEX_VALIDATION_MESSAGES.PASSWORD.STRONG
REGEX_VALIDATION_MESSAGES.NAME.TURKISH_NAME
REGEX_VALIDATION_MESSAGES.EMAIL.STANDARD
```

#### Swagger Modifications

```typescript
// main.ts dosyasında
const config = new DocumentBuilder()
  .setTitle('Finance Tracker API')
  .setDescription('...')
  .addBearerAuth(/* JWT config */)
  .build();
```

## 🎯 Best Practices

### ✅ Documentation Standards

1. **Comprehensive Descriptions**: Her endpoint için detaylı açıklama
2. **Example Values**: Her field için örnek değerler
3. **Error Responses**: Tüm olası error durumları
4. **Response Types**: Detaylı response schema'ları
5. **Security Documentation**: Authentication gereksinimleri

### ✅ Development Guidelines

1. **Centralized Regex**: Tüm regex kalıpları tek dosyada
2. **Consistent Naming**: Tutarlı naming convention
3. **Type Safety**: TypeScript tip güvenliği
4. **Validation Messages**: Merkezi hata mesajları
5. **Turkish Support**: Türkçe karakter desteği

## 🚀 Sonuç

Bu Swagger dokümantasyonu şunları sağlar:

- ✅ **Interactive Testing**: Doğrudan browser'dan API test etme
- ✅ **Auto-Generated Docs**: Otomatik dokümantasyon üretimi
- ✅ **Type Safety**: TypeScript ile tip güvenliği
- ✅ **Standards Compliance**: OpenAPI 3.0 standartlarına uyum
- ✅ **Security Documentation**: JWT authentication dokümantasyonu
- ✅ **Centralized Regex**: Merkezi regex yönetimi
- ✅ **Turkish Support**: Türkçe karakter desteği

API dokümantasyonunuz `http://localhost:3000/api/docs` adresinde hazır! 🎉
