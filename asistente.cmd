@echo off
rem Double click opens the site's assistant (Antigravity CLI, agy) in this folder with
rem automatic approval of every action. Windows counterpart of asistente.command.
rem The first message makes the assistant read AGENTS.md (operation mode) and greet the owner
rem in Spanish; it is written without accents so no console code page can garble it.
rem If agy is missing, install it in PowerShell with:
rem   irm https://antigravity.google/cli/install.ps1 | iex
rem and sign in once with the owner's Google account.
chcp 65001 >nul
cd /d "%~dp0"
set "PATH=%USERPROFILE%\.local\bin;%PATH%"
where agy >nul 2>&1 || (
  echo El asistente no esta instalado en este computador. Avise al desarrollador.
  pause
  exit /b 1
)
agy --dangerously-skip-permissions --prompt-interactive "Sin comentar lo que haces, lee el archivo AGENTS.md de esta carpeta y sigue sus reglas al pie de la letra durante toda esta conversacion (modo operacion). Despues responde unicamente con un saludo en espanol para el dueno de CBM, de dos lineas, preguntandole que cambio necesita en el sitio."
