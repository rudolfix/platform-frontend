#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

run_backend() {
    # copy config e2e as default .env if doesnt exist
    cp -n ../app/config/.env.e2e ../.env || true

    echo "Cloning backend repo..."
    if [[ -z "${BACKEND_DEPLOYMENT_KEY}" ]]; then
        if [ ! -d "./platform-backend" ]; then
            git clone git@github.com:Neufund/platform-backend.git
        fi
    else
        if [ ! -d "./platform-backend" ]; then
            echo "${BACKEND_DEPLOYMENT_KEY}" | base64 -d > "./cert"
            chmod 600 ./cert
            GIT_SSH_COMMAND='ssh -i ./cert' git clone git@github.com:Neufund/platform-backend.git
        fi
    fi

    echo "Running backend"
    cd ./platform-backend

    make run

    cd ..
    echo "Backend running"
}

frontend_pid=0
run_frontend() {
    echo "Building production build of frontend"
    yarn build:prod

    echo "Starting up local http server"
    ../scripts/prod-like-srv.sh&
    frontend_pid=$!
    echo "Frontend running"
}

if lsof -Pi :5001 -sTCP:LISTEN -t > /dev/null ; then
    echo "Detected already started backend..."
else
    echo "Starting up backend..."
    run_backend
fi

if lsof -Pi :9090 -sTCP:LISTEN -t > /dev/null ; then
    echo "Detected already started frontend..."
else
    echo "Starting up frontend..."
    run_frontend
fi

yarn test:e2e:cypress


if [[ $frontend_pid -ne 0 ]]; then
    echo "Killing frontend server..."
    kill -9 $frontend_pid
fi


