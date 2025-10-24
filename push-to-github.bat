@echo off
echo ========================================
echo TalkChat Studio - Push to GitHub
echo ========================================
echo.

echo [1/3] Committing changes...
git commit -m "Initial commit - TalkChat Studio"

echo.
echo [2/3] Checking remote...
git remote -v

echo.
echo [3/3] Pushing to GitHub...
git push -u origin master

echo.
echo ========================================
echo Done! Check https://github.com/kimundume/talkchatstudio
echo ========================================
pause
