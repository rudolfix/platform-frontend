#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

echo "Cloning backend repo..."
echo "$BACKEND_DEPLOYMENT_KEY" > "key"
GIT_SSH_COMMAND='ssh -i ./key' git clone git@github.com:Neufund/platform-backend.git 2> /dev/null

echo "Running backend"
make run 2> /dev/null

echo "Building production build of frontend"
yarn build:prod

echo "Starting up local http server"
../../scripts/prod-like-srv.sh&
