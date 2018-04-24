#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"
cd ..

echo "Clearing..."
rm -rf build-tmp extracted-messages

echo "Creating tmp typescript project build..."
node_modules/.bin/tsc -p ./tsconfig.json --target ES6 --module es6 --jsx preserve --outDir build-tmp || true
echo "Done"

echo "Extracting messages..."
node_modules/.bin/babel --plugins react-intl "build-tmp/**/*.jsx"
echo "done"

echo "Removing tmp build"
rm -rf build-tmp
