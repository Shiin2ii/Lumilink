# LumiLink Backend API Documentation

## Overview
LumiLink Backend API cung cấp đầy đủ các endpoint để quản lý hệ thống bio-link platform, bao gồm authentication, profile management, link management, analytics, upload, settings, social features và public access.

## Base URL
```
http://localhost:3001/api/v1
```

## Authentication
Hầu hết các endpoint cần authentication bằng JWT token trong header:
```
Authorization: Bearer <jwt_token>
```

## API Endpoints

### 🔐 Authentication (`/auth`)
- `POST /register` - Đăng ký tài khoản mới
- `POST /login` - Đăng nhập
- `POST /logout` - Đăng xuất
- `GET /me` - Lấy thông tin người dùng hiện tại
- `GET /check-username/:username` - Kiểm tra username có sẵn
- `GET /check-email/:email` - Kiểm tra email có sẵn
- `PUT /change-password` - Đổi mật khẩu

### 👤 Profiles (`/profiles`)
- `GET /:username` - Lấy profile công khai theo username
- `PUT /update` - Cập nhật profile (cần auth)

### 🔗 Links (`/links`)
- `GET /me` - Lấy danh sách links của user (cần auth)
- `POST /` - Tạo link mới (cần auth)
- `PUT /:id` - Cập nhật link (cần auth)
- `DELETE /:id` - Xóa link (cần auth)
- `PUT /reorder` - Sắp xếp lại thứ tự links (cần auth)
- `POST /:id/click` - Track click link (cần auth)

### 📊 Analytics (`/analytics`)
- `GET /profile` - Lấy analytics profile (cần auth)
- `GET /links` - Lấy analytics links (cần auth)
- `GET /overview` - Tổng quan analytics (cần auth)

### 📁 Upload (`/upload`)
- `POST /avatar` - Upload avatar (cần auth)
- `POST /background` - Upload background (cần auth)
- `DELETE /avatar` - Xóa avatar (cần auth)
- `DELETE /background` - Xóa background (cần auth)
- `GET /storage` - Thông tin storage (cần auth)
- `GET /files/:filename` - Lấy file đã upload

### ⚙️ Settings (`/settings`)
- `GET /profile` - Lấy cài đặt profile (cần auth)
- `PUT /profile` - Cập nhật cài đặt profile (cần auth)
- `GET /theme` - Lấy cài đặt theme (cần auth)
- `PUT /theme` - Cập nhật theme (cần auth)
- `GET /privacy` - Lấy cài đặt privacy (cần auth)
- `PUT /privacy` - Cập nhật privacy (cần auth)
- `GET /notifications` - Lấy cài đặt notifications (cần auth)
- `PUT /notifications` - Cập nhật notifications (cần auth)
- `GET /domain` - Lấy cài đặt custom domain (cần auth)
- `PUT /domain` - Cập nhật custom domain (cần auth)

### 👥 Social (`/social`)
- `POST /follow/:username` - Follow user (cần auth)
- `DELETE /unfollow/:username` - Unfollow user (cần auth)
- `GET /followers` - Danh sách followers (cần auth)
- `GET /following` - Danh sách following (cần auth)
- `GET /stats` - Thống kê social (cần auth)
- `GET /discover` - Discover users để follow (cần auth)
- `GET /check-follow/:username` - Kiểm tra có đang follow không (cần auth)

### 🌐 Public (`/public`)
- `GET /profile/:username` - Lấy profile công khai
- `POST /link/:linkId/click` - Track click link công khai
- `GET /search` - Tìm kiếm profiles công khai
- `GET /trending` - Profiles trending
- `GET /stats` - Thống kê platform

### 👑 Admin (`/admin`)
- `GET /dashboard` - Dashboard admin (cần auth admin)
- `GET /users` - Danh sách users (cần auth admin)
- `PUT /users/:id/status` - Cập nhật status user (cần auth admin)
- `GET /analytics/platform` - Analytics platform (cần auth admin)

## Features Đã Implement

### ✅ Authentication & Authorization
- JWT-based authentication
- Password hashing với bcrypt
- Username/email uniqueness validation
- Password change với verification
- User session management

### ✅ Profile Management
- User profiles với customizable themes
- Bio, avatar, background images
- Public/private profile settings
- Custom domains
- SEO settings

### ✅ Link Management
- CRUD operations cho links
- Drag & drop reordering
- Click tracking
- Custom styling per link
- Featured links
- Active/inactive status

### ✅ File Upload System
- Avatar upload
- Background image upload
- File size và type validation
- Local storage với cleanup
- Static file serving

### ✅ Analytics & Tracking
- Profile view tracking
- Link click analytics
- User engagement metrics
- Time-based statistics
- Export capabilities

### ✅ Social Features
- Follow/unfollow system
- Followers/following lists
- User discovery
- Social stats
- Trending profiles

### ✅ Customization
- Theme system
- Color schemes
- Background options
- Font selection
- Button styles

### ✅ Privacy & Security
- Public/private profiles
- Content moderation
- Rate limiting
- Input validation
- Error handling

### ✅ Public API
- No-auth endpoints
- Profile sharing
- Link tracking
- Search functionality
- Platform statistics

## Database Schema
Hệ thống sử dụng PostgreSQL với Supabase, bao gồm các bảng:
- `users` - Thông tin người dùng
- `profiles` - Profile settings và customization
- `links` - User links
- `analytics` - Event tracking
- `follows` - Social relationships
- `admin_logs` - Admin activities

## Error Handling
API sử dụng HTTP status codes chuẩn:
- `200` - Success
- `201` - Created
- `400` - Bad Request
- `401` - Unauthorized
- `403` - Forbidden
- `404` - Not Found
- `409` - Conflict
- `500` - Internal Server Error

## Response Format
Tất cả responses có format JSON chuẩn:
```json
{
  "success": true/false,
  "message": "Description",
  "data": {...}
}
```

## Rate Limiting
- API có rate limiting để prevent abuse
- Default: 100 requests/minute per IP
- Auth endpoints: 10 requests/minute per IP

## File Upload Limits
- Max file size: 10MB
- Supported formats: JPG, PNG, GIF, WebP
- Max total storage per user: 100MB

## Next Steps
1. Test tất cả endpoints
2. Implement real-time features (WebSocket)
3. Add email notifications
4. Implement advanced analytics
5. Add payment system (premium features)
6. Mobile app API optimization
