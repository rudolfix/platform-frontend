#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

aws s3 sync ../.reg s3://${AWS_BUCKET_NAME}/${CURRENT_KEY}/report/

aws s3 sync ../__screenshots__ s3://${AWS_BUCKET_NAME}/${CURRENT_KEY}/images/
