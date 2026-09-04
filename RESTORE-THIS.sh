#!/bin/sh
# TRUTHPOLE Archive Beta 3 — one-shot restore for any Grok Build chat.
# Unzip this snapshot over /workspace, then:  sh RESTORE-THIS.sh
set -eu
cd "$(dirname "$0")"
echo "TRUTHPOLE Archive Beta 3 — npm install + startup"
rm -f .node_modules.lock
rm -rf node_modules
npm install
chmod +x startup.sh
sh ./startup.sh
