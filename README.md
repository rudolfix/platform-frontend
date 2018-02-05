# platform-frontend

[![Build Status](https://travis-ci.org/Neufund/platform-frontend.svg?branch=master)](https://travis-ci.org/Neufund/platform-frontend)
[![codecov](https://codecov.io/gh/Neufund/platform-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/Neufund/platform-frontend)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Run project

To run project requires an Ethereum node to connect to. For dev purposes, we can use local
development node [ganache-cli](https://github.com/trufflesuite/ganache-cli) (former `testrpc`).
Start it by issuing `yarn ganache` command in a separate terminal window so it runs simultaneously
with webpack dev server.

```sh
yarn
yarn ganache
yarn start
```

## Running tests

```
yarn test # checks formatting, runs linter and tests
```

### Fix all autofixable errors and run tests

```
yarn test:fix
```

### Production build

```
yarn build:prod
```
