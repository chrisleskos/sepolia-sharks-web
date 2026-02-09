@echo off
echo Running logo cache script...

REM IMPORTANT: use CALL so control returns
call npm run cache-logos
if errorlevel 1 (
    echo.
    echo Script FAILED!
    goto end
)

echo.
echo Logo cache completed successfully.
echo.

REM Git add (current repo + specific file)
git add .
git add ../js/assets/team-logos.js
if errorlevel 1 (
    echo Git add FAILED!
    goto end
)

REM Git commit
git commit -m "Update cached logos"
if errorlevel 1 (
    echo Git commit FAILED! (maybe nothing to commit?)
    goto end
)

REM Git push
git push
if errorlevel 1 (
    echo Git push FAILED!
    goto end
)

echo.
echo Git commit & push completed successfully.

:end
echo.
echo Done. Closing in 10 seconds...

for /l %%i in (10,-1,1) do (
    echo %%i...
    timeout /t 1 >nul
)

echo.
echo Press any key to exit...
pause >nul
