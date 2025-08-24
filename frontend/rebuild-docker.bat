@echo off
echo ========================================
echo REBUILDING LUMILINK FRONTEND CONTAINER
echo ========================================

echo.
echo 🔄 Stopping existing containers...
docker-compose down

echo.
echo 🗑️ Removing old images...
docker rmi lumilink-frontend_frontend 2>nul

echo.
echo 🔨 Building new container with updated dependencies...
docker-compose build --no-cache

echo.
echo 🚀 Starting containers...
docker-compose up -d

echo.
echo ✅ Frontend container rebuilt successfully!
echo 📱 Frontend: http://localhost:3000
echo.

pause
