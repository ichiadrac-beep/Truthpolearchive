#!/usr/bin/env node
/**
 * TRUTHPOLE backup — `npm run backup`
 * Creates backups/TRUTHPOLE-backup-<timestamp>.zip and …-latest.zip
 */
import { spawnSync } from "node:child_process";
import { fileURLToPath } from "node:url";
import path from "node:path";

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const sh = path.join(root, "scripts", "backup-project.sh");
const r = spawnSync("bash", [sh], { cwd: root, stdio: "inherit", env: process.env });
process.exit(r.status ?? 1);
