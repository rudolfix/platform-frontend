#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

: ${BASE_KEY?"Need to set STATE"}
: ${CURRENT_KEY?"Need to set STATE"}

echo "BASE_KEY: ${BASE_KEY}"
echo "CURRENT_KEY: ${CURRENT_KEY}"
echo "AWS_BUCKET_NAME: ${AWS_BUCKET_NAME}"

echo "Preparing visual regression tests"
./vis-reg-prepare.sh

../node_modules/.bin/reg-suit compare

echo "Uploading results"
./vis-reg-upload-results.sh
