#!/usr/bin/env bash
rm -rf ./dist
tsc
copyfiles -s -u 2 src/components/**/*.scss ./dist/components
cp -r ./src/assets ./dist/assets
cp -r ./src/styles ./dist/styles
cp ./src/types.d.ts ./dist/types.d.ts
