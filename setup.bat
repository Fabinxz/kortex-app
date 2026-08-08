@echo off
REM KORTEX Setup Script for Windows
REM This script helps you set up the KORTEX dashboard quickly

echo.
echo ============================================
echo   KORTEX // Setup Script
echo ============================================
echo.

REM Check if .env exists
if not exist .env (
    echo [WARNING] .env file not found. Creating from template...
    copy .env.example .env
    echo [SUCCESS] Created .env file
    echo.
    echo [INFO] Please edit .env and add your DATABASE_URL
    echo        Then run this script again.
    pause
    exit /b 1
)

REM Check if DATABASE_URL is set
findstr /C:"DATABASE_URL=" .env >nul
if errorlevel 1 (
    echo [ERROR] DATABASE_URL not found in .env
    echo         Please add your PostgreSQL connection string
    pause
    exit /b 1
)

echo [INFO] Installing dependencies...
call pnpm install
if errorlevel 1 call npm install

echo.
echo [INFO] Setting up database...
call pnpm prisma:generate
if errorlevel 1 call npm run prisma:generate

call pnpm prisma:push
if errorlevel 1 call npm run prisma:push

echo.
echo [INFO] Seeding database with 90 days of mock data...
call pnpm prisma:seed
if errorlevel 1 call npm run prisma:seed

echo.
echo ============================================
echo [SUCCESS] Setup complete!
echo.
echo To start the development server:
echo   pnpm dev  (or npm run dev)
echo.
echo To open Prisma Studio:
echo   pnpm prisma studio
echo.
echo ============================================
echo KORTEX is ready. Happy studying!
echo.
pause
pnpm dev
pnpm dev
echo   pnpm dev
pnpm dev
npm run dev
npm run dev
.\setup.bat
npm install
npm run dev

.\setup.bat
npm install
npm run dev
.\setup.bat
npm install
npm run dev
.\setup.bat
npm install
npm run dev
.\setup.bat
npm install
npm run dev
.\setup.bat
npm install
npm run dev
.\setup.bat
npm install
npm run dev
.\setup.bat
npm install
npm run dev
.\setup.bat
npm install
npm run dev
