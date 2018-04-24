#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

echo "Creating messages..."
node_modules/.bin/babel "./app/**/*.tsx"
echo "done"

echo "Merging with locale file for en-en"
node ./scripts/mergeMessagesWithLocales.js
echo "done"
