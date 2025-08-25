# 🌟 LumiLink - Bio-Link Platform

<div align="center">

![LumiLink Logo](https://img.shields.io/badge/LumiLink-Bio--Link%20Platform-blue?style=for-the-badge&logo=link&logoColor=white)

**🚀 Nền tảng bio-link mạnh mẽ và linh hoạt**
<img width="1541" height="957" alt="image" src="https://github.com/user-attachments/assets/b970b83a-cdde-44c1-a551-23432fe55ec3" />

[![Node.js](https://img.shields.io/badge/Node.js-18.x-green?style=flat-square&logo=node.js)](https://nodejs.org/)
[![React](https://img.shields.io/badge/React-18.x-blue?style=flat-square&logo=react)](https://reactjs.org/)
[![Docker](https://img.shields.io/badge/Docker-Ready-blue?style=flat-square&logo=docker)](https://docker.com/)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Supabase-green?style=flat-square&logo=postgresql)](https://supabase.com/)

[🎯 Demo Live](https://demo.lumilink.site) • [📚 Tài liệu API](backend/API_DOCUMENTATION.md) • [🐛 Báo lỗi](https://github.com/Shiin2ii/lumilink/issues) • [💬 Discord](https://discord.gg/lumilink)

</div>

---

## ✨ Tính năng nổi bật

<table>
<tr>
<td width="50%">

### 🎨 **Giao diện đẹp mắt**
- 📱 Responsive hoàn hảo
- 🎭 Animations mượt mà
- 🖼️ Upload ảnh/video background

</td>
<td width="50%">

### 📊 **Analytics mạnh mẽ**  
- 📈 Thống kê chi tiết từng link
- 🌍 Phân tích theo quốc gia
- 📱 Device & browser tracking
- 📅 Báo cáo theo thời gian

</td>
</tr>
<tr>
<td>

### 🏆 **Hệ thống Badge**
- 🎯 25+ achievements
- 🏅 Leaderboard cộng đồng  
- 🎮 Gamification experience
- ⭐ Unlock premium features

</td>
<td>

### 👑 **Premium Features**
- 🎨 Unlimited customization
- 📊 Advanced analytics
- 🌐 Custom domain
- 📧 Email integration

</td>
</tr>
</table>

---

## 🚀 Quick Start - Chạy chương trình 

### 🐳 **Cách 1: Docker (Khuyến nghị)**

```bash
# 📥 Clone repository
git clone https://github.com/Shiin2ii/lumilink.git
cd lumilink

# 🚀 Khởi động  hệ thống
docker-compose up -d

# 🎉 Truy cập ứng dụng
# Frontend: http://localhost:3000
# Backend API: http://localhost:3001
# API Docs: http://localhost:3001/api-docs
```

### ⚡ **Cách 2: Development Mode**

<details>
<summary><b>🔧 Setup Backend</b></summary>

```bash
# 📂 Vào thư mục backend
cd backend

# 📋 Tạo file environment
cp env.example .env

# 📦 Cài đặt dependencies
npm install

# 🚀 Khởi động development server
npm run dev
# hoặc sử dụng Docker


docker-compose up backend-dev
```
<img width="1450" height="451" alt="image" src="https://github.com/user-attachments/assets/220f8960-76ee-4044-9174-5f87dbb09276" />


</details>

<details>
<summary><b>🎨 Setup Frontend</b></summary>

```bash
# 📂 Vào thư mục frontend  
cd frontend

# 📦 Cài đặt dependencies
npm install

# 🚀 Khởi động React app
npm start
# hoặc sử dụng Docker
docker-compose up app-dev

```
<img width="719" height="844" alt="{B22A4535-EE7B-420D-ABB9-601F2873D316}" src="https://github.com/user-attachments/assets/6d9a047c-ae89-4f81-bfc4-c9b2ef01985f" />
<img width="857" height="847" alt="{8E9FF4A0-B908-4730-B91A-DA09DEDCD7FB}" src="https://github.com/user-attachments/assets/0a8cc26a-2dd0-473c-a34a-fd89932a0545" />


</details>

---

## 🧪 Testing & Demo

### 🎮 **Tài khoản Demo có sẵn**

<table>
<tr>
<th>👤 Role</th>
<th>📧 Email</th>
<th>🔑 Password</th>
<th>🎯 Mục đích</th>
</tr>
<tr>
<td>👑 <b>Admin</b></td>
<td><code>admin@lumilink.site</code></td>
<td><code>admin1234</code></td>
<td>Quản lý hệ thống, xem analytics tổng</td>
</tr>
<tr>
<td>🆓 <b>Free User</b></td>
<td><code>userfree@lumilink.site</code></td>
<td><code>User@123</code></td>
<td>Trải nghiệm tính năng cơ bản</td>
</tr>
<tr>
<td>💎 <b>Premium</b></td>
<td><code>userpremium@lumilink.site</code></td>
<td><code>User@123</code></td>
<td>Tất cả tính năng premium</td>
</tr>
</table>

### 🧪 **Chạy Test Suite**

```bash
# 🔍 Test toàn bộ API endpoints
cd backend
docker-compose run --rm backend-dev node test-api.js

# 📊 Kết quả mẫu:
# ✅ Authentication: 8/8 passed
# ✅ Profiles: 6/6 passed  
# ✅ Links: 10/10 passed
# ✅ Analytics: 5/5 passed
# 🎉 Total: 29/29 tests passed!
```

---

## 🏗️ Kiến trúc hệ thống

<div align="center">

```mermaid
graph TB
    A[👤 User] --> B[🌐 Frontend React]
    B --> C[🔄 API Gateway]
    C --> D[🏗️ Backend Node.js]
    D --> E[🗄️ Supabase PostgreSQL]
    D --> F[📁 File Storage]
    D --> G[📊 Analytics Engine]
    
    H[👑 Admin] --> I[📊 Admin Dashboard]
    I --> C
    
    J[🌍 Public] --> K[🔗 Public Links]
    K --> C
```

</div>

### 🛠️ **Tech Stack**

<table>
<tr>
<td><b>Frontend</b></td>
<td>
  <img src="https://img.shields.io/badge/React-18.x-blue?logo=react" alt="React">
  <img src="https://img.shields.io/badge/TailwindCSS-3.x-blue?logo=tailwindcss" alt="Tailwind">
  <img src="https://img.shields.io/badge/Framer%20Motion-Animation-purple?logo=framer" alt="Framer Motion">
</td>
</tr>
<tr>
<td><b>Backend</b></td>
<td>
  <img src="https://img.shields.io/badge/Node.js-18.x-green?logo=node.js" alt="Node.js">
  <img src="https://img.shields.io/badge/Express.js-4.x-black?logo=express" alt="Express">
  <img src="https://img.shields.io/badge/JWT-Auth-orange?logo=jsonwebtokens" alt="JWT">
</td>
</tr>
<tr>
<td><b>Database</b></td>
<td>
  <img src="https://img.shields.io/badge/PostgreSQL-14.x-blue?logo=postgresql" alt="PostgreSQL">
  <img src="https://img.shields.io/badge/Supabase-Backend-green?logo=supabase" alt="Supabase">
</td>
</tr>
<tr>
<td><b>DevOps</b></td>
<td>
  <img src="https://img.shields.io/badge/Docker-Containerized-blue?logo=docker" alt="Docker">
  <img src="https://img.shields.io/badge/Nginx-Reverse%20Proxy-green?logo=nginx" alt="Nginx">
</td>
</tr>
</table>

---

## 📁 Cấu trúc dự án

```
🌟 LumiLink/
├── 🗂️ backend/                 # Node.js API Server
│   ├── 📝 API_DOCUMENTATION.md  # 📚 Tài liệu API chi tiết  
│   ├── 🐳 docker-compose.yml    # Docker configuration
│   ├── 🔧 src/
│   │   ├── 🎮 controllers/      # Business logic
│   │   ├── 🛣️ routes/          # API endpoints
│   │   ├── 🗃️ models/          # Database models
│   │   ├── 🛡️ middleware/       # Auth, validation, etc.
│   │   └── ⚙️ config/          # App configuration
│   ├── 🧪 test-api.js          # Comprehensive API tests
│   └── 📁 uploads/             # User uploaded files
│
├── 🎨 frontend/                # React Web App
│   ├── 🐳 docker-compose.yml   # Frontend Docker setup
│   ├── 📱 src/
│   │   ├── 🧩 components/       # Reusable UI components
│   │   ├── 📄 pages/           # App pages/screens
│   │   ├── 🔄 services/        # API integration
│   │   ├── 🎯 contexts/        # React contexts
│   │   └── 🎨 styles/          # CSS & Tailwind
│   └── 🌍 public/              # Static assets
│       └── 🎭 decorations/     # 400+ badge icons
│
└── 📖 README.md               # 👋 Bạn đang đọc đây!
```

---

## 🎯 Hướng dẫn sử dụng nhanh

### 1️⃣ **Tạo Profile đầu tiên**
```bash
# 🚀 Khởi động app
docker-compose up -d

# 🌐 Mở browser
open http://localhost:3000

# ✨ Đăng ký tài khoản mới hoặc dùng demo account
```

### 2️⃣ **Tùy chỉnh giao diện**
- 🎨 Chọn theme yêu thích
- 🖼️ Upload avatar & background
- ✏️ Viết bio hấp dẫn
- 🎭 Chọn font & màu sắc

### 3️⃣ **Thêm links**
- ➕ Thêm link Instagram, TikTok, Website...
- 🎨 Tùy chỉnh style từng button
- 📊 Theo dõi số click realtime
- 🔄 Drag & drop để sắp xếp

### 4️⃣ **Chia sẻ profile**
```
🔗 Link của bạn: lumilink.site/username
📱 QR Code tự động
📊 Xem analytics chi tiết
```

---

## 🤝 Contributing

Chúng tôi rất hoan nghênh mọi đóng góp! 

### 🎯 **Cách đóng góp:**

1. 🍴 **Fork** repository này
2. 🌿 Tạo **feature branch**: `git checkout -b feature/AmazingFeature`
3. 💾 **Commit** changes: `git commit -m 'Add some AmazingFeature'`
4. 📤 **Push** to branch: `git push origin feature/AmazingFeature`
5. 🔄 Tạo **Pull Request**

### 🐛 **Báo lỗi:**
- 🎯 Sử dụng [GitHub Issues](https://github.com/Shiin2ii/lumilink/issues)
- 📝 Mô tả chi tiết lỗi và cách reproduce
- 📸 Attach screenshots nếu có

### 💡 **Đề xuất tính năng:**
- 🌟 Tạo [Feature Request](https://github.com/Shiin2ii/lumilink/issues/new?template=feature_request.md)
- 💭 Giải thích use case và lợi ích
- 🎨 Mockup/wireframe nếu có

---

## 📞 Liên hệ & Hỗ trợ

<div align="center">

### 🌟 **Kết nối với chúng tôi**

[![Discord](https://img.shields.io/badge/Discord-Join%20Community-7289da?style=for-the-badge&logo=discord&logoColor=white)](https://discord.gg/lumilink)
[![Email](https://img.shields.io/badge/Email-support@lumilink.site-red?style=for-the-badge&logo=gmail&logoColor=white)](mailto:support@lumilink.site)
[![Website](https://img.shields.io/badge/Website-lumilink.site-blue?style=for-the-badge&logo=google-chrome&logoColor=white)](https://lumilink.site)

</div>

### 📚 **Tài liệu & Resources**

- 📖 [**API Documentation**](backend/API_DOCUMENTATION.md) - Chi tiết 50+ endpoints
- 🎥 [**Video Tutorials**](https://youtube.com/lumilink) - Hướng dẫn từng bước  
- 📊 [**System Status**](https://status.lumilink.site) - Uptime & performance
- 💬 [**Community Forum**](https://community.lumilink.site) - Q&A và thảo luận

### 🆘 **Hỗ trợ nhanh**

- 🐛 **Bug Reports**: [GitHub Issues](https://github.com/Shiin2ii/lumilink/issues)
- 💡 **Feature Requests**: [Feature Board](https://features.lumilink.site)  
- 📧 **Email Support**: support@lumilink.site
- 💬 **Live Chat**: Available on website

---

## 📄 License

Dự án này được phát hành dưới giấy phép **MIT License**.

```
MIT License

Copyright (c) 2025 LumiLink Team

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software...
```

📖 [Đọc full license](LICENSE)

---

<div align="center">


### 💝 **Cảm ơn bạn đã quan tâm đến LumiLink!**

**Nếu project này hữu ích, đừng quên ⭐ star repo để ủng hộ team nhé!**

**Made with ❤️ by LumiLink Team **

</div>
