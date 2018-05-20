#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

mkdir -p ../.reg/expected

aws s3 sync s3://${AWS_BUCKET_NAME}/${BASE_KEY}/images/ ../.reg/expected
