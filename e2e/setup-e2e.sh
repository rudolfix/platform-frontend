#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "Cloning backend repo..."
# git clone git@github.com:Neufund/platform-backend.git 2> /dev/null

cd ./platform-backend
git pull

echo "Running backend"
# make run 2> /dev/null

echo "Building production build of frontend"
yarn build:prod

echo "Starting up local http server"
../../scripts/prod-like-srv.sh
