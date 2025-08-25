# 🌟LumiLink Backend API Documentation

## 📋 Tổng quan
LumiLink Backend API cung cấp hệ thống bio-link platform hoàn chỉnh với các tính năng:
- 🔐 Authentication & Authorization  
- 👤 Profile Management
- 🔗 Link Management
- 📊 Analytics & Tracking
- 🏆 Badge System
- 👑 Admin Dashboard
- 📁 File Upload
- 🌐 Public Access

## 🌐 Base URL
```
Production: https://api.lumilink.site/api/v1
Development: http://localhost:3001/api/v1
```

## 🔑 Authentication
Hầu hết endpoints yêu cầu JWT token trong header:
```http
Authorization: Bearer <jwt_token>
```

## 📚 API Endpoints

### 🔐 Authentication (`/auth`)

#### POST `/register` - Đăng ký tài khoản
```http
POST /api/v1/auth/register
Content-Type: application/json

{
  "username": "newuser",
  "email": "user@example.com", 
  "password": "SecurePass123",
  "displayName": "New User"
}
```

**Response:**
```json
{
  "success": true,
  "message": "User registered successfully",
  "user": {
    "id": "uuid",
    "username": "newuser",
    "email": "user@example.com",
    "displayName": "New User",
    "plan": "free",
    "createdAt": "2025-01-17T10:00:00.000Z"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### POST `/login` - Đăng nhập
```http
POST /api/v1/auth/login
Content-Type: application/json

{
  "email": "user@example.com",
  "password": "SecurePass123"
}
```

**Response:**
```json
{
  "success": true,
  "message": "Login successful",
  "user": {
    "id": "uuid",
    "username": "newuser",
    "email": "user@example.com",
    "displayName": "New User",
    "plan": "free"
  },
  "token": "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

#### GET `/me` - Thông tin người dùng hiện tại
```http
GET /api/v1/auth/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "user": {
    "id": "uuid",
    "username": "newuser",
    "email": "user@example.com",
    "displayName": "New User",
    "plan": "free",
    "avatar": "https://example.com/avatar.jpg",
    "bio": "My bio here",
    "isActive": true,
    "createdAt": "2025-01-17T10:00:00.000Z",
    "lastLogin": "2025-01-17T15:30:00.000Z"
  }
}
```

#### GET `/check-username/:username` - Kiểm tra username
```http
GET /api/v1/auth/check-username/testuser
```

**Response:**
```json
{
  "success": true,
  "available": false,
  "message": "Username is already taken"
}
```

#### PUT `/change-password` - Đổi mật khẩu
```http
PUT /api/v1/auth/change-password
Authorization: Bearer <token>
Content-Type: application/json

{
  "currentPassword": "OldPass123",
  "newPassword": "NewPass456"
}
```

---

### 👤 Profiles (`/profiles`)

#### GET `/:username` - Lấy profile công khai
```http
GET /api/v1/profiles/testuser
```

**Response:**
```json
{
  "success": true,
  "profile": {
    "id": "uuid",
    "username": "testuser",
    "displayName": "Test User",
    "bio": "Welcome to my profile!",
    "avatar": "https://example.com/avatar.jpg",
    "backgroundImage": "https://example.com/bg.jpg",
    "theme": {
      "backgroundColor": "#ffffff",
      "textColor": "#000000",
      "buttonStyle": "rounded",
      "fontFamily": "Inter"
    },
    "links": [
      {
        "id": "uuid",
        "title": "My Website",
        "url": "https://mywebsite.com",
        "isActive": true,
        "sortOrder": 1,
        "clicks": 150,
        "style": {
          "backgroundColor": "#007bff",
          "textColor": "#ffffff"
        }
      }
    ],
    "socialStats": {
      "followers": 245,
      "following": 89,
      "totalViews": 1250,
      "totalClicks": 890
    },
    "badges": [
      {
        "id": "badge-uuid",
        "name": "Early Adopter",
        "icon": "🌟",
        "color": "#ffd700"
      }
    ]
  }
}
```

#### PUT `/update` - Cập nhật profile
```http
PUT /api/v1/profiles/update
Authorization: Bearer <token>
Content-Type: application/json

{
  "displayName": "Updated Name",
  "bio": "New bio description",
  "theme": {
    "backgroundColor": "#f8f9fa",
    "textColor": "#212529",
    "buttonStyle": "rounded",
    "fontFamily": "Poppins"
  }
}
```

---

### 🔗 Links (`/links`)

#### GET `/me` - Lấy danh sách links của user
```http
GET /api/v1/links/me
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "links": [
    {
      "id": "uuid",
      "title": "My Portfolio",
      "url": "https://portfolio.com",
      "description": "Check out my work",
      "isActive": true,
      "isFeatured": false,
      "sortOrder": 1,
      "clicks": 45,
      "style": {
        "backgroundColor": "#007bff",
        "textColor": "#ffffff",
        "borderRadius": "8px"
      },
      "createdAt": "2025-01-15T10:00:00.000Z",
      "updatedAt": "2025-01-16T14:30:00.000Z"
    }
  ],
  "total": 1
}
```

#### POST `/` - Tạo link mới
```http
POST /api/v1/links
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "New Link",
  "url": "https://example.com",
  "description": "Link description",
  "isActive": true,
  "isFeatured": false,
  "style": {
    "backgroundColor": "#28a745",
    "textColor": "#ffffff"
  }
}
```

#### PUT `/:id` - Cập nhật link
```http
PUT /api/v1/links/uuid
Authorization: Bearer <token>
Content-Type: application/json

{
  "title": "Updated Link Title",
  "url": "https://updated-url.com",
  "isActive": true
}
```

#### PUT `/reorder` - Sắp xếp lại thứ tự links
```http
PUT /api/v1/links/reorder
Authorization: Bearer <token>
Content-Type: application/json

{
  "links": [
    {"id": "uuid1", "sortOrder": 1},
    {"id": "uuid2", "sortOrder": 2},
    {"id": "uuid3", "sortOrder": 3}
  ]
}
```

#### POST `/:id/click` - Track click link
```http
POST /api/v1/links/uuid/click
Authorization: Bearer <token>
Content-Type: application/json

{
  "referrer": "https://social-media.com",
  "userAgent": "Mozilla/5.0...",
  "country": "VN",
  "device": "mobile"
}
```

---

### 📊 Analytics (`/analytics`)

#### GET `/overview` - Tổng quan analytics
```http
GET /api/v1/analytics/overview
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "analytics": {
    "totalViews": 1250,
    "totalClicks": 890,
    "conversionRate": 71.2,
    "topLinks": [
      {
        "id": "uuid",
        "title": "Portfolio",
        "clicks": 245,
        "percentage": 27.5
      }
    ],
    "viewsByDate": [
      {"date": "2025-01-17", "views": 45, "clicks": 32},
      {"date": "2025-01-16", "views": 38, "clicks": 28}
    ],
    "deviceStats": {
      "mobile": 65.4,
      "desktop": 28.3,
      "tablet": 6.3
    },
    "countryStats": [
      {"country": "VN", "views": 450, "percentage": 36.0},
      {"country": "US", "views": 320, "percentage": 25.6}
    ]
  }
}
```

#### GET `/links` - Analytics cho từng link
```http
GET /api/v1/analytics/links?period=7d
Authorization: Bearer <token>
```

---

### 🏆 Badges (`/badges`)

#### GET `/` - Lấy tất cả badges
```http
GET /api/v1/badges?category=engagement
```

**Response:**
```json
{
  "success": true,
  "data": [
    {
      "id": "uuid",
      "name": "First Click",
      "description": "Get your first link click",
      "icon": "🎯",
      "category": "engagement",
      "targetValue": 1,
      "color": "#28a745",
      "isActive": true
    }
  ],
  "total": 15
}
```

#### GET `/user` - Badges của user hiện tại
```http
GET /api/v1/badges/user
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "badges": [
    {
      "id": "uuid",
      "name": "Early Adopter",
      "description": "Joined in the first month",
      "icon": "🌟",
      "earnedAt": "2025-01-17T10:00:00.000Z",
      "progress": 100
    }
  ],
  "stats": {
    "totalEarned": 5,
    "totalAvailable": 25,
    "completionRate": 20.0
  }
}
```

---

### 📁 Upload (`/upload`)

#### POST `/avatar` - Upload avatar
```http
POST /api/v1/upload/avatar
Authorization: Bearer <token>
Content-Type: multipart/form-data

avatar: [file]
```

**Response:**
```json
{
  "success": true,
  "message": "Avatar uploaded successfully",
  "fileUrl": "https://api.lumilink.site/uploads/avatars/avatar-123456789.jpg",
  "fileName": "avatar-123456789.jpg",
  "fileSize": 245760
}
```

#### POST `/background` - Upload background
```http
POST /api/v1/upload/background
Authorization: Bearer <token>
Content-Type: multipart/form-data

background: [file]
```

#### GET `/storage` - Thông tin storage
```http
GET /api/v1/upload/storage
Authorization: Bearer <token>
```

**Response:**
```json
{
  "success": true,
  "storage": {
    "used": 15728640,
    "limit": 104857600,
    "percentage": 15.0,
    "files": [
      {
        "type": "avatar",
        "url": "https://api.lumilink.site/uploads/avatars/avatar-123.jpg",
        "size": 245760,
        "uploadedAt": "2025-01-17T10:00:00.000Z"
      }
    ]
  }
}
```

---

### 👑 Admin (`/admin`)

#### GET `/stats` - Thống kê hệ thống
```http
GET /api/v1/admin/stats
Authorization: Bearer <admin_token>
```

**Response:**
```json
{
  "success": true,
  "stats": {
    "users": {
      "total": 1250,
      "active": 890,
      "newThisWeek": 45,
      "premiumUsers": 125
    },
    "links": {
      "total": 8950,
      "active": 7234,
      "newThisWeek": 234
    },
    "analytics": {
      "totalViews": 125000,
      "totalClicks": 89500,
      "conversionRate": 71.6
    },
    "system": {
      "uptime": 99.9,
      "memoryUsage": {
        "used": 512,
        "total": 2048
      },
      "databaseStatus": "healthy"
    }
  }
}
```

#### GET `/users` - Quản lý users
```http
GET /api/v1/admin/users?page=1&limit=20&search=test
Authorization: Bearer <admin_token>
```

---

### 🌐 Public (`/public`)

#### GET `/profile/:username` - Profile công khai
```http
GET /api/v1/public/profile/testuser
```

#### POST `/link/:linkId/click` - Track click công khai
```http
POST /api/v1/public/link/uuid/click
Content-Type: application/json

{
  "referrer": "https://instagram.com",
  "userAgent": "Mozilla/5.0...",
  "country": "VN"
}
```

#### GET `/search` - Tìm kiếm profiles
```http
GET /api/v1/public/search?q=developer&limit=10
```

**Response:**
```json
{
  "success": true,
  "results": [
    {
      "username": "developer123",
      "displayName": "John Developer",
      "bio": "Full-stack developer",
      "avatar": "https://example.com/avatar.jpg",
      "followers": 245,
      "isVerified": false
    }
  ],
  "total": 15,
  "page": 1
}
```

---

## 🔧 Error Handling

### HTTP Status Codes
- `200` - Success
- `201` - Created  
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `429` - Too Many Requests
- `500` - Internal Server Error

### Error Response Format
```json
{
  "success": false,
  "message": "Error description",
  "error": "VALIDATION_ERROR",
  "details": {
    "field": "email",
    "code": "INVALID_FORMAT"
  }
}
```

### Common Error Codes
- `VALIDATION_ERROR` - Dữ liệu đầu vào không hợp lệ
- `AUTH_REQUIRED` - Cần đăng nhập
- `ACCESS_DENIED` - Không có quyền truy cập
- `RESOURCE_NOT_FOUND` - Tài nguyên không tồn tại
- `DUPLICATE_ENTRY` - Dữ liệu đã tồn tại
- `RATE_LIMIT_EXCEEDED` - Vượt quá giới hạn request
- `FILE_TOO_LARGE` - File quá lớn
- `INVALID_FILE_TYPE` - Loại file không được hỗ trợ

---

## 🚀 Rate Limiting

### Default Limits
- **General API**: 100 requests/minute per IP
- **Auth endpoints**: 10 requests/minute per IP  
- **Upload endpoints**: 5 requests/minute per user
- **Public endpoints**: 200 requests/minute per IP

### Headers
```http
X-RateLimit-Limit: 100
X-RateLimit-Remaining: 95
X-RateLimit-Reset: 1642694400
```

---

## 📁 File Upload Specifications

### Avatar Upload
- **Max size**: 5MB
- **Formats**: JPG, PNG, GIF, WebP
- **Dimensions**: Max 1024x1024px
- **Auto-resize**: Yes

### Background Upload  
- **Max size**: 10MB
- **Formats**: JPG, PNG, GIF, WebP, MP4 (video)
- **Dimensions**: Max 1920x1080px
- **Duration** (video): Max 30 seconds

### Storage Limits
- **Free users**: 50MB total
- **Premium users**: 500MB total

---

## 🔒 Security Features

### Authentication
- JWT tokens với expiration
- Refresh token mechanism
- Password hashing với bcrypt (salt rounds: 12)

### Data Protection
- Input validation và sanitization
- SQL injection protection
- XSS protection
- CSRF protection
- CORS configuration

### Privacy
- Public/private profile settings
- Anonymous analytics option
- GDPR compliance ready

---

## 📊 Database Schema

### Core Tables
```sql
-- Users table
users (
  id UUID PRIMARY KEY,
  username VARCHAR(50) UNIQUE,
  email VARCHAR(255) UNIQUE,
  password_hash VARCHAR(255),
  display_name VARCHAR(100),
  plan VARCHAR(20) DEFAULT 'free',
  is_active BOOLEAN DEFAULT true,
  created_at TIMESTAMP,
  updated_at TIMESTAMP
)

-- Profiles table  
profiles (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  bio TEXT,
  avatar_url VARCHAR(500),
  background_url VARCHAR(500),
  theme JSONB,
  settings JSONB,
  is_public BOOLEAN DEFAULT true
)

-- Links table
links (
  id UUID PRIMARY KEY,
  user_id UUID REFERENCES users(id),
  title VARCHAR(200),
  url VARCHAR(2000),
  description TEXT,
  is_active BOOLEAN DEFAULT true,
  sort_order INTEGER,
  style JSONB,
  clicks INTEGER DEFAULT 0
)
```

---

## 🧪 Testing

### Test Accounts
```javascript
// Admin account
{
  email: "admin@lumilink.site",
  password: "admin1234",
  role: "admin"
}

// Free user
{
  email: "userfree@lumilink.site", 
  password: "User@123",
  plan: "free"
}

// Premium user
{
  email: "userpremium@lumilink.site",
  password: "User@123", 
  plan: "premium"
}
```

### Running Tests
```bash
# Chạy test suite
cd backend
docker-compose run --rm backend-dev node test-api.js

# Test specific endpoint
npm run test -- --grep "auth"
```

---

## 🚀 Deployment

### Environment Variables
```bash
# Database
SUPABASE_URL=https://your-project.supabase.co
SUPABASE_ANON_KEY=your-anon-key
SUPABASE_SERVICE_KEY=your-service-key

# JWT
JWT_SECRET=your-super-secret-key
JWT_EXPIRES_IN=7d

# File Upload
MAX_FILE_SIZE=10485760
UPLOAD_DIR=/app/uploads

# Rate Limiting  
RATE_LIMIT_WINDOW=900000
RATE_LIMIT_MAX=100
```

### Docker Deployment
```bash
# Build and run
docker-compose up -d

# Scale services
docker-compose up --scale backend=3
```

---

## 📈 Roadmap

### Phase 1 (Current) ✅
- ✅ Authentication system
- ✅ Profile management  
- ✅ Link management
- ✅ Basic analytics
- ✅ File upload
- ✅ Admin dashboard

### Phase 2 (Q2 2025) 🚧
- [ ] Real-time notifications (WebSocket)
- [ ] Advanced analytics dashboard
- [ ] Email marketing integration
- [ ] Custom domains
- [ ] Team collaboration features

### Phase 3 (Q3 2025) 📋
- [ ] Mobile app API optimization
- [ ] Payment system (Stripe/PayPal)
- [ ] Advanced customization
- [ ] A/B testing for links
- [ ] API webhooks

### Phase 4 (Q4 2025) 🎯
- [ ] AI-powered insights
- [ ] Social media auto-posting
- [ ] Advanced integrations
- [ ] White-label solutions

---

## 📞 Support

- **Documentation**: [https://docs.lumilink.site](https://docs.lumilink.site)
- **API Status**: [https://status.lumilink.site](https://status.lumilink.site)
- **Support Email**: support@lumilink.site


---

*Last updated: January 17, 2025 | Version: 1.2.0*
