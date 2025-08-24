# LumiLink - Hướng dẫn cài đặt & chạy test nhanh

## 1. Cài đặt Backend

- Di chuyển vào thư mục `backend`:
  ```sh
  cd backend
  ```
- Tạo file `.env` từ mẫu nếu cần:
  ```sh
  copy env.example .env
  ```
- Cài đặt các package (nếu chạy local):
  ```sh
  npm install
  ```
- Khởi động backend bằng Docker Compose:
  ```sh
  docker-compose up backend-dev
  ```
  > Hoặc dùng các script `.bat` có sẵn như `docker-dev.bat`.

## 2. Cài đặt Frontend

- Di chuyển vào thư mục `frontend`:
  ```sh
  cd frontend
  ```
- Cài đặt các package (nếu chạy local):
  ```sh
  npm install
  ```
- Khởi động frontend bằng Docker Compose:
  ```sh
  docker-compose up app-dev
  ```

## 3. Chạy test-api.js bằng Docker

- Đảm bảo backend đã chạy ở chế độ dev (port 3001).
- Mở terminal tại thư mục `backend` và chạy:
  ```sh
  docker-compose run --rm backend-dev node test-api.js
  ```
  > Lệnh này sẽ chạy toàn bộ test suite kiểm thử API.

---

- Tài khoản test có sẵn:
  - Admin: admin@lumilink.site / admin1234
  - Free User: userfree@lumilink.site / User@123
  - Premium User: userpremium@lumilink.site / User@123

- Kết quả test sẽ hiển thị số lượng passed/failed/skipped và chi tiết từng API.

> Xem thêm chi tiết trong file `test-api.js` và tài liệu API trong `API_DOCUMENTATION.md`.
