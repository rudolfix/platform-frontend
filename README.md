# platform-frontend

[![Build Status](https://travis-ci.org/Neufund/platform-frontend.svg?branch=master)](https://travis-ci.org/Neufund/platform-frontend)
[![codecov](https://codecov.io/gh/Neufund/platform-frontend/branch/master/graph/badge.svg)](https://codecov.io/gh/Neufund/platform-frontend)
[![code style: prettier](https://img.shields.io/badge/code_style-prettier-ff69b4.svg)](https://github.com/prettier/prettier)

## Running project

### Prerequisites

* running ethereum node on port `8545`. To start local instance just run `yarn ganache`
* running `signature_auth_api` on port `5000`

```sh
yarn
yarn ganache   # in separate window
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


### Docs

- [Component Development Guidelines](./docs/component-development-guidelines.md)
