#!/bin/bash

# KORTEX Setup Script
# This script helps you set up the KORTEX dashboard quickly

echo "🎯 KORTEX // Setup Script"
echo "================================"
echo ""

# Check if .env exists
if [ ! -f .env ]; then
    echo "⚠️  .env file not found. Creating from template..."
    cp .env.example .env
    echo "✅ Created .env file"
    echo ""
    echo "🔧 Please edit .env and add your DATABASE_URL"
    echo "   Then run this script again."
    exit 1
fi

# Check if DATABASE_URL is set
if ! grep -q "^DATABASE_URL=" .env; then
    echo "❌ DATABASE_URL not found in .env"
    echo "   Please add your PostgreSQL connection string"
    exit 1
fi

echo "📦 Installing dependencies..."
pnpm install || npm install

echo ""
echo "🗄️  Setting up database..."
pnpm prisma:generate || npm run prisma:generate
pnpm prisma:push || npm run prisma:push

echo ""
echo "🌱 Seeding database with 90 days of mock data..."
pnpm prisma:seed || npm run prisma:seed

echo ""
echo "✅ Setup complete!"
echo ""
echo "🚀 To start the development server:"
echo "   pnpm dev  (or npm run dev)"
echo ""
echo "📊 To open Prisma Studio:"
echo "   pnpm prisma studio"
echo ""
echo "================================"
echo "KORTEX is ready. Happy studying! 📚"
