# Production Dockerfile for LumiLink Backend
FROM node:20-alpine

# Create a non-root user
RUN addgroup -g 1001 -S nodejs
RUN adduser -S nextjs -u 1001

# Thiết lập thư mục làm việc
WORKDIR /app

# Copy package.json và package-lock.json
COPY package*.json ./

# Cài đặt dependencies (production only)
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY --chown=nextjs:nodejs . .

# Tạo thư mục cần thiết
RUN mkdir -p logs uploads && chown -R nextjs:nodejs logs uploads

# Switch to non-root user
USER nextjs

# Expose port 3001
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
  CMD node -e "require('http').get('http://localhost:3001/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) })"

# Start production server
CMD ["node", "src/server.js"]
