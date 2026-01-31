@echo off
setlocal

echo ===============================
echo   WFM Adjuster installation
echo ===============================
echo.

cd /d "%~dp0" || (
    echo Failed to enter project root
    pause
    exit /b 1
)

git --version >nul 2>&1 || (
    echo Git is not installed or not in PATH
    pause
    exit /b 1
)

echo Updating git submodules...
git submodule update --init --recursive || (
    echo Failed to update git submodules
    pause
    exit /b 1
)

cd /d "%~dp0WFMApi" || (
    echo Failed to enter WFMApi directory
    pause
    exit /b 1
)

echo Installing npm dependencies...
call npm install || (
    echo npm install failed
    pause
    exit /b 1
)

cd /d "%~dp0"
echo.
if not exist "%~dp0config\userJWT.js" (
    copy "config\userJWT.example.js" "config\userJWT.js" >nul
    echo userJWT.js created from example.
) else (
    echo userJWT.js already exists, skipping.
)
echo.
echo ===============================
echo   Installation complete
echo ===============================
echo.
echo Don't forget to add your JWT in \config\userJWT.js
echo.
pause