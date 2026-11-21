#!/usr/bin/env bash
# Builds the whole site into ./dist:
#   - everything from ./public (homepage, Legacy Dash, /waf/) as-is
#   - the Astro blog under /blog
#   - /404.html (shared not-found page) and /build.json (freshness stamp)
#
# SHOW_DRAFTS=1 includes drafts and future-dated posts (PR previews only).
set -euo pipefail
cd "$(dirname "$0")/.."

rm -rf dist
cp -R public dist

pushd blog >/dev/null
if [[ ! -d node_modules ]]; then
  # CI installs and verifies signatures in its own steps before this script runs.
  # --ignore-scripts: no dependency gets to run install hooks on the build machine.
  npm ci --ignore-scripts --no-audit --no-fund
fi
npx astro build
popd >/dev/null

cp dist/blog/404.html dist/404.html

cat > dist/build.json <<JSON
{
  "builtAt": "$(date -u +%Y-%m-%dT%H:%M:%SZ)",
  "commit": "${GITHUB_SHA:-local}",
  "drafts": $([[ "${SHOW_DRAFTS:-}" == "1" ]] && echo true || echo false)
}
JSON

echo "Built $(find dist -type f | wc -l) files, $(du -sh dist | cut -f1) total."
