#!/usr/bin/env bash
# TRUTHPOLE — full project backup (source + public + config, no node_modules)
set -euo pipefail

ROOT="$(cd "$(dirname "$0")/.." && pwd)"
cd "$ROOT"

STAMP="$(date -u +%Y%m%d-%H%M%S)"
OUT_DIR="${BACKUP_DIR:-$ROOT/backups}"
mkdir -p "$OUT_DIR"

NAME="TRUTHPOLE-backup-${STAMP}.zip"
OUT="$OUT_DIR/$NAME"

# Refresh note inside tree
cat > "$ROOT/TRUTHPOLE-BACKUP.txt" << NOTE
TRUTHPOLE — The Archive
Automated backup created ${STAMP} UTC

Contents: src, public, server, scripts, migrations, package.json, configs
Excludes: node_modules, dist, .output, .nitro, .vercel, logs

Restore:
  unzip -o ${NAME} -d /path/to/project
  npm install
  npm run dev   # or: sh startup.sh
NOTE

echo "Backing up $ROOT → $OUT"

zip -qr "$OUT" . \
  -x "node_modules/*" \
  -x "*/node_modules/*" \
  -x "backups/*" \
  -x ".git/*" \
  -x "dist/*" \
  -x ".output/*" \
  -x ".nitro/*" \
  -x ".vercel/*" \
  -x "*.log" \
  -x "tmp/*" \
  -x ".cache/*"

# Also write a stable "latest" pointer
cp -f "$OUT" "$OUT_DIR/TRUTHPOLE-backup-latest.zip"

SIZE="$(du -h "$OUT" | awk '{print $1}')"
echo "OK  $OUT  ($SIZE)"
echo "OK  $OUT_DIR/TRUTHPOLE-backup-latest.zip"
echo "$OUT"
