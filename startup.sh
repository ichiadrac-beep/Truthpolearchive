#!/bin/sh
set -eu
# App Builder Play listens on 0.0.0.0:8080. Modules install on fuse is unreliable,
# so prefer the fast /tmp copy when present.
if [ -x /tmp/tp-run/node_modules/.bin/vite ]; then
  ROOT=/tmp/tp-run
else
  ROOT=/workspace
  cd /workspace 2>/dev/null || ROOT=/home/workdir/artifacts/tp
fi
cd "$ROOT"
export PATH="$ROOT/node_modules/.bin:$PATH"
node scripts/preview.mjs stop 2>/dev/null || true
if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi
npm run dev >>/tmp/app-startup.log 2>&1 &
