@echo off
echo ========================================
echo Updating Dependencies and Pushing to GitHub
echo ========================================

echo [1/3] Updating package.json...

:: Update Next.js to v15.5.6
powershell -Command "(Get-Content package.json) -replace '\"next\": \"16\.0\.0\"', '\"next\": \"^15.5.6\"' | Set-Content package.json"

echo [2/3] Committing changes...
git add package.json
git commit -m "Update Next.js to v15.5.6 for compatibility"

echo [3/3] Pushing to GitHub...
git push

echo.
echo ========================================
echo ✅ Done! Your changes have been pushed to GitHub.
echo ========================================
echo.
echo Next steps:
echo 1. Go to Vercel dashboard
echo 2. Your new deployment should start automatically
echo 3. If not, trigger a manual deployment

echo.
pause
