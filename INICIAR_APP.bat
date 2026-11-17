@echo off
setlocal
title TALEMTUMCLASS - Iniciar aplicacion
cd /d "%~dp0"

rem 1) Usa Node.js instalado en el sistema, si existe.
where node >nul 2>nul
if not errorlevel 1 goto node_ok

rem 2) Si no esta en el PATH, usa la instalacion local de Node en este usuario.
set "LOCAL_NODE=%LOCALAPPDATA%\Programs\nodejs"
if exist "%LOCAL_NODE%\node.exe" (
  set "PATH=%LOCAL_NODE%;%PATH%"
  goto node_ok
)

rem 3) Ultimo recurso: el Node portatil de la carpeta temporal.
set "PORTABLE_NODE=C:\Users\javir\AppData\Local\Temp\node-portable\node-v22.13.1-win-x64"
if exist "%PORTABLE_NODE%\node.exe" (
  set "PATH=%PORTABLE_NODE%;%PATH%"
  goto node_ok
)

echo.
echo  No se encontro Node.js en este equipo.
echo.
echo  1. Descarga Node.js LTS desde: https://nodejs.org
echo  2. Instalalo con las opciones por defecto.
echo  3. Cierra esta ventana y vuelve a ejecutar INICIAR_APP.bat
echo.
pause
exit /b 1

:node_ok
if not exist "node_modules" (
  echo Instalando dependencias por primera vez...
  call npm install
  if errorlevel 1 (
    echo.
    echo Ocurrio un error al instalar las dependencias.
    pause
    exit /b 1
  )
)

echo.
echo  Iniciando TALEMTUMCLASS...
echo  Cuando aparezca la URL, abre: http://localhost:5173
echo  Para detener el servidor pulsa Ctrl + C.
echo.

call npm run dev

echo.
echo El servidor se detuvo.
pause
