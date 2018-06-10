#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

cd ../dist

# we want to prerender only index.html
cp ./index.html ./index.html_

(cd .. && node ./node_modules/.bin/prep ./dist)

node ../scripts/fix-prerender-pages.js
