#!/usr/bin/env bash
set -euo pipefail

API_PORT="${API_PORT:-5000}"
WEB_PORT="${WEB_PORT:-5173}"
BASE_PATH="${BASE_PATH:-/}"
API_PROXY_TARGET="${API_PROXY_TARGET:-http://localhost:${API_PORT}}"

cleanup() {
  trap - INT TERM EXIT
  kill 0 2>/dev/null || true
  wait 2>/dev/null || true
}
trap cleanup INT TERM EXIT

echo "Starting CampusOS API on :${API_PORT} and web on :${WEB_PORT}"

PORT="${API_PORT}" \
  pnpm --filter @workspace/api-server run dev &

PORT="${WEB_PORT}" \
  BASE_PATH="${BASE_PATH}" \
  API_PROXY_TARGET="${API_PROXY_TARGET}" \
  pnpm --filter @workspace/campusos run dev &

wait