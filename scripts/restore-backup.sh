#!/usr/bin/env bash
# TRUTHPOLE — restore from a backup zip into project root
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
ZIP="${1:-}"

if [ -z "$ZIP" ]; then
  if [ -f "$ROOT/backups/TRUTHPOLE-backup-latest.zip" ]; then
    ZIP="$ROOT/backups/TRUTHPOLE-backup-latest.zip"
  else
    echo "Usage: $0 <backup.zip>"
    echo "Or place a zip at backups/TRUTHPOLE-backup-latest.zip"
    exit 1
  fi
fi

if [ ! -f "$ZIP" ]; then
  echo "Not found: $ZIP"
  exit 1
fi

echo "Restoring $ZIP → $ROOT"
# Extract over project; do not wipe node_modules unless missing
unzip -qo "$ZIP" -d "$ROOT"

if [ ! -d "$ROOT/node_modules" ]; then
  echo "Installing dependencies…"
  (cd "$ROOT" && npm install --no-audit --no-fund)
fi

echo "Restore complete."
echo "Start with:  sh $ROOT/startup.sh   or   npm run dev"
