#!/bin/zsh
# Double click opens the site's assistant (Antigravity CLI, `agy`) in this folder with
# automatic approval of every action, so the owner never sees a technical confirmation prompt.
# The first message makes the assistant read AGENTS.md (operation mode) before anything else
# and greet the owner in Spanish: tested on agy 1.1.24, the CLI does not load AGENTS.md by
# itself, and without this it behaves like a generic assistant.
# If it does not open: install it with `curl -fsSL https://antigravity.google/cli/install.sh | bash`
# and sign in once with the owner's Google account.
cd "$(dirname "$0")" || exit 1
export PATH="$HOME/.local/bin:$PATH"
exec agy --dangerously-skip-permissions --prompt-interactive "Sin comentar lo que haces, lee el archivo AGENTS.md de esta carpeta y sigue sus reglas al pie de la letra durante toda esta conversación (modo operación). Después responde únicamente con un saludo en español para el dueño de CBM, de dos líneas, preguntándole qué cambio necesita en el sitio."
