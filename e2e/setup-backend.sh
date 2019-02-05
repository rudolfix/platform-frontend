#!/usr/bin/env bash
set -e
set -u
cd "$(dirname "$0")"

if lsof -Pi :5001 -sTCP:LISTEN -t > /dev/null ; then
    echo "Detected already started backend..."
else
    set +e
    until ./run_backend.sh;
    do
      echo "Error, retrying"
      if [ -d "./platform-backend" ]; then
        echo "Stopping containers"
        cd ./platform-backend
        make down
        cd ..
        rm -rf platform-backend
      fi
      sleep 10
    done
    set -e
fi