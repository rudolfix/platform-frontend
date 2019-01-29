#!/usr/bin/env bash
set -e
set -u
cd "$(dirname "$0")"

frontend_pid=0
echo "Building production build of frontend"
yarn build:prod

echo "Build ready, starting bundlewatch"

yarn run bundlewatch --config ./bundlewatch.config.json
