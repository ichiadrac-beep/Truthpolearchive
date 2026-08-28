#!/bin/sh
set -eu
cd /workspace

# :8081 is QA-only — a revive must never inherit a stale built-output preview.
node scripts/preview.mjs stop || true

if [ ! -d node_modules ]; then
  echo "node_modules missing — installing deps"
  npm install
fi

if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
  exit 0
fi

: >/tmp/app-startup.log
npm run dev >>/tmp/app-startup.log 2>&1 &
DEV_PID=$!

i=0
while [ "$i" -lt 90 ]; do
  if ! kill -0 "$DEV_PID" 2>/dev/null; then
    echo "dev server died before 8080 answered"
    tail -n 40 /tmp/app-startup.log || true
    exit 1
  fi
  if curl -sf -o /dev/null --max-time 2 http://127.0.0.1:8080/; then
    exit 0
  fi
  i=$((i + 1))
  sleep 1
done

echo "timed out waiting for http://127.0.0.1:8080/ to return 200"
tail -n 40 /tmp/app-startup.log || true
exit 1
