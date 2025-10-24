@echo off
echo ========================================
echo TalkChat Studio - Fix and Restart
echo ========================================
echo.

echo [1/4] Stopping any running dev servers...
taskkill /F /IM node.exe 2>nul
timeout /t 2 /nobreak >nul

echo [2/4] Clearing Next.js cache...
if exist .next (
    rmdir /s /q .next
    echo ✓ Cleared .next directory
) else (
    echo ✓ .next directory already clean
)

echo [3/4] Clearing Turbopack cache...
if exist .turbopack (
    rmdir /s /q .turbopack
    echo ✓ Cleared .turbopack directory
) else (
    echo ✓ .turbopack directory already clean
)

echo [4/4] Starting development server...
echo.
echo ========================================
echo Server starting on http://localhost:3000
echo ========================================
echo.

npm run dev
