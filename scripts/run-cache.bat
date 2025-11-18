@echo off
echo Running logo cache script...

REM Run npm script and show errors if any
npm run cache-logos || (
    echo.
    echo Script FAILED!
)

echo.
echo Done. Closing in 10 seconds...

for /l %%i in (10,-1,1) do (
    echo %%i...
    timeout /t 1 >nul
)

echo.
echo Press any key to exit...
pause >nul