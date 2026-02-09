@echo off
echo Running logo cache script...

REM Run npm script
call npm run cache-logos
if errorlevel 1 (
    echo.
    echo Script FAILED!
    goto end
)

echo.
echo Logo cache completed successfully.
echo.

REM Git add
git add .
git add ../js/assets/team-logos.js
if errorlevel 1 (
    echo Git add FAILED!
    goto end
)

REM Check if there is anything to commit
git diff --cached --quiet
if errorlevel 1 (
    echo Changes detected. Committing...
    git commit -m "Update cached logos"
    if errorlevel 1 (
        echo Git commit FAILED!
        goto end
    )
) else (
    echo No changes to commit.
)

REM Git push
git push
if errorlevel 1 (
    echo Git push FAILED!
    goto end
)

echo.
echo Git operations completed successfully.

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
