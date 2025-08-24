#!/bin/bash

echo "🚀 Starting LumiLink Backend..."
echo "📁 Current directory: $(pwd)"
echo "📋 Environment variables:"
echo "   NODE_ENV: $NODE_ENV"
echo "   PORT: $PORT"
echo "   SUPABASE_URL: $SUPABASE_URL"

echo "📂 Files in current directory:"
ls -la

echo "📂 Files in src directory:"
ls -la src/

echo "🔧 Node.js version: $(node --version)"
echo "📦 NPM version: $(npm --version)"

echo "🏃 Starting Node.js application..."
exec node src/server.js
