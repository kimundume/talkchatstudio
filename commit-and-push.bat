@echo off
echo ========================================
echo Committing and Pushing Changes
echo ========================================
echo.

echo [1/3] Adding all changes...
git add .

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to add changes to git
    pause
    exit /b %ERRORLEVEL%
)

echo [2/3] Committing changes...
git commit -m "Fix TypeScript and React hook issues in ChatWidget"

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to commit changes
    pause
    exit /b %ERRORLEVEL%
)

echo [3/3] Pushing to GitHub...
git push origin main

if %ERRORLEVEL% NEQ 0 (
    echo Error: Failed to push to GitHub
    pause
    exit /b %ERRORLEVEL%
)

echo.
echo ========================================
echo ✅ Successfully pushed to GitHub!
echo ========================================

echo.
pause
