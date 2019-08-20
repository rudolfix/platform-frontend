## Web

A web UI of neufund platform.

### Useful links:

**Storybook** (latest `master`): https://neufund.github.io/platform-frontend/

## Running project

### Prerequisites

- running ethereum node on port `8545`. To start local instance just run `yarn ganache`
- running `signature_auth_api` on port `5000`

```sh
yarn
yarn ganache   # in separate window. You need to upload neufund contracts. Keep on reading.
yarn start
```

#### Using external backend

Set NF_REMOTE_BACKEND_PROXY_ROOT variable in your .env file and run `yarn start:remote` to connect
to remote backend.

#### Running production build locally

```sh
yarn build:prod # build production bundle

sh ./scripts/prod-like-srv.sh # run the server
```

#### Uploading contracts

To upload modified version of Neufund Smartcontract that allows for easier blockchain development
you need to checkout
[`kk/frontend-platform-fixtures`](https://github.com/Neufund/platform-contracts/pull/55) branch and
run `yarn fixture`.

Typechain (it generates typed wrappers on smartcontracts) runs automatically after doing `yarn` to
trigger it manually do: `yarn generate:contracts`.

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

### Extracting translations from the app

```
yarn intl:extract
```

[Read more](./docs/working-with-intl.md)

### Update contract artifacts submodule

If you need to push the contract artifacts to the newest version yourself, then run.

```
yarn contract-artifacts:update
```

then commit the submodules change. It is important to commit before you run yarn, since the yarn
prepare script will revert uncommited changes to git submodules, and repin them to the local
version.

```
yarn
```

If somebody else committed a new version of the submodules, just run yarn, and everything will be
updated

You will most of the time not need this as updating the contracts is included in

```
yarn lint:fix
```

job

### Docs

- [Component Development Guidelines](./docs/component-development-guidelines.md)
- [React Guidelines](./docs/react-guidelines.md)
- [Testing production build](./docs/testing-prod-build.md)
- [Working with Intl](./docs/working-with-intl.md)
- [Feature flags](./docs/feature-flags.md)
