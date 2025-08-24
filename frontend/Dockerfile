# Sử dụng Node.js 18 làm base image
FROM node:18-alpine

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies
RUN npm ci --only=production

# Copy source code
COPY . .

# Build ứng dụng
RUN npm run build

# Sử dụng nginx để serve static files
FROM nginx:alpine

# Copy build files từ stage trước
COPY --from=0 /app/build /usr/share/nginx/html

# Copy nginx config nếu cần
# COPY nginx.conf /etc/nginx/nginx.conf

# Expose port 80
EXPOSE 80

# Start nginx
CMD ["nginx", "-g", "daemon off;"]
