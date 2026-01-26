#!/bin/bash
# Script para actualizar el system prompt del chatbot en Vercel
# Uso: ./scripts/update-prompt.sh

set -e

SCRIPT_DIR="$(cd "$(dirname "$0")" && pwd)"
PROJECT_DIR="$(dirname "$SCRIPT_DIR")"
PROMPT_FILE="$PROJECT_DIR/chatbot-prompt.txt"

if [ ! -f "$PROMPT_FILE" ]; then
    echo "Error: No se encuentra $PROMPT_FILE"
    exit 1
fi

echo "Leyendo prompt desde $PROMPT_FILE..."
PROMPT_CONTENT=$(cat "$PROMPT_FILE")

echo "Actualizando CHATBOT_SYSTEM_PROMPT en Vercel..."
vercel env rm CHATBOT_SYSTEM_PROMPT production -y 2>/dev/null || true
echo "$PROMPT_CONTENT" | vercel env add CHATBOT_SYSTEM_PROMPT production

echo "Redesplegando..."
vercel --prod

echo "Prompt actualizado correctamente."
