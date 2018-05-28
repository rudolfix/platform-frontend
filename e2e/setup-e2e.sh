#!/usr/bin/env bash
set -e
cd "$(dirname "$0")"

run_backend() {
    # copy config e2e as default .env if doesnt exist
    cp -n ../app/config/.env.e2e ../.env || true

    echo "Cloning backend repo..."
    if [[ -z "${BACKEND_DEPLOYMENT_KEY}" ]]; then
        if [ ! -d "./platform-backend" ]; then
            git clone git@github.com:Neufund/platform-backend.git -b kk/fix-smartcontract-SHA
        fi
    else
        if [ ! -d "./platform-backend" ]; then
            echo "using env variable"
            echo "${BACKEND_DEPLOYMENT_KEY}" | base64 -d > "./cert"
            chmod 600 ./cert
            ssh-agent sh -c 'ssh-add ./cert; git clone git@github.com:Neufund/platform-backend.git; cd ./platform-backend; git reset --hard bb1a7b53c8bfe1ae2700318cca2f147878daa1e9'
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

yarn test:e2e:cypress:record

if [[ $frontend_pid -ne 0 ]]; then
    echo "Killing frontend server..."
    kill -9 $frontend_pid
fi


