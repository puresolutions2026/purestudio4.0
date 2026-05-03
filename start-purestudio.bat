@echo off
echo ==============================================
echo PureStudio 4.0 - Ecosistema Local
echo ==============================================

:: 1. Validación
echo [1/3] Validando entorno...
node -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] Node.js no está instalado.
    exit /b %errorlevel%
)
npm -v >nul 2>&1
if %errorlevel% neq 0 (
    echo [ERROR] npm no está instalado.
    exit /b %errorlevel%
)

:: 2. Instalación
echo [2/3] Instalando dependencias...
cd node-backend
call npm install
cd ..\frontend
call npm install
cd ..

:: 3. Lanzamiento
echo [3/3] Iniciando servicios...

start "PureStudio Backend" cmd /c "cd node-backend && npm start"

echo Esperando que el backend se estabilice...
timeout /t 5 /nobreak >nul

start "PureStudio Frontend" cmd /c "cd frontend && npm run dev"

echo ==============================================
echo ENTORNO LISTO
echo Frontend: http://localhost:5180
echo Backend:  http://localhost:3000
echo ==============================================
pause
