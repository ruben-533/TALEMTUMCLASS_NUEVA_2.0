@echo off
setlocal
cd /d "%~dp0"

set "VSCODE=%LOCALAPPDATA%\Programs\Microsoft VS Code\bin\code.cmd"

if exist "%VSCODE%" (
  call "%VSCODE%" "TALEMTUCLASS.code-workspace"
  exit /b 0
)

where code >nul 2>nul
if not errorlevel 1 (
  call code "TALEMTUCLASS.code-workspace"
  exit /b 0
)

echo.
echo No se encontro Visual Studio Code en la ubicacion habitual.
echo Abre VS Code manualmente y elige:
echo   Archivo ^> Abrir carpeta... ^> C:\Users\javir\Documents\TALEMTUCLASS
echo.
pause
