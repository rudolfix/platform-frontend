# Web

[![Project dependencies Status](https://david-dm.org/Neufund/platform-frontend/status.svg?path=packages/web)](https://david-dm.org/Neufund/platform-frontend?path=packages/web)
[![Project devDependencies Status](https://david-dm.org/Neufund/platform-frontend/dev-status.svg?path=packages/web)](https://david-dm.org/Neufund/platform-frontend?type=dev&path=packages/web)

A web UI of Neufund platform.

## Useful links:

**Storybook** (latest `master`): https://neufund.github.io/platform-frontend/

## Dependencies:

1. NodeJS version >=10.0.0 <12.0.0.
2. [Yarn](https://yarnpkg.com/lang/en/).

## Setting up the environment

1. Clone the platform-frontend repo: `git clone git@github.com:Neufund/platform-frontend.git`.
2. cd into the project: `cd platform-frontend`.
3. Install dependencies `yarn`.
4. Generate contract artifacts `yarn contract-artifacts:generate`.
5. Setup environment variables:

- Make sure that .env file is in place ./packages/web/.env.
- If it's not, create it and run `yarn start:remote`.
- Add following variables to it:
  - NF_REMOTE_BACKEND_PROXY_ROOT="https://backendApiUrl" (e.g. https://platform.neufund.io/api/ for
    DEV)
  - NF_REMOTE_NODE_PROXY_ROOT=="https://ethNodeUrl" (e.g. https://platform.neufund.io/nodes/private)

6. Install MetaMask chrome extension and set it up.
7. Available fixtures for testing on development environment are available:
   ./git_modules/platform-contracts-artifacts/localhost/fixtures.json.
8. To test with predefined accounts:

- Find an JSON object representing the fixture that you are interested in in
  ./git_modules/platform-contracts-artifacts/localhost/fixtures.json.
- Copy private key property value from it "privateKey": "0x7ccd...49f1".
- Paste it into MetaMask, account import.

## Running project

#### Using external backend and ethereum node (recommended way to start frontend quickly)

- Run `yarn start:remote` to connect to remote backend and node.
- Visit https://localhost:9090/ in your web browser.

#### Using backend deployed on a remote virtual machine

- Set IP address of a virtual machine in NF_VM_ADDRESS environment variable in .env file.
- Run `yarn start:remote:vm` to connect to remote backend and node.
- Open https://localhost:9090/ in your web browser.

#### Running production build locally

```bash
yarn build:prod # build production bundle

sh ./scripts/prod-like-srv.sh # run the server
```

## Uploading contracts

To upload modified version of Neufund Smartcontract that allows for easier blockchain development
you need to checkout
[`kk/frontend-platform-fixtures`](https://github.com/Neufund/platform-contracts/pull/55) branch and
run `yarn fixture`.

Typechain (it generates typed wrappers on smartcontracts) runs automatically after doing `yarn` to
trigger it manually do: `yarn generate:contracts`.

## Running tests

```bash
yarn test
```

## Fix all autofixable errors

```bash
yarn lint:fix
```

## Production build

```bash
yarn build:prod
```

## Running storybook

```bash
yarn storybook
```

Open http://localhost:9001 in you web browser.

## Extracting translations from the app

```bash
yarn intl:extract
```

[Read more](./docs/working-with-intl.md)

## Update contract artifacts submodule

If you need to push the contract artifacts to the newest version yourself, then run.

```bash
yarn contract-artifacts:update
```

then commit the submodules change. It is important to commit before you run yarn, since the yarn
prepare script will revert uncommited changes to git submodules, and repin them to the local
version.

```bash
yarn
```

If somebody else committed a new version of the submodules, just run yarn, and everything will be
updated

You will most of the time not need this as updating the contracts is included in the job.

```bash
yarn lint:fix
```

## Possible issues:

- If you get a following error, when making a transaction with Meta Mask:

```
inpage.js:1 MetaMask - RPC Error: [object Object]
{code: -32603, message: "[object Object]", data: {…}, stack: "Error: [object Object]↵    at a (chrome-extension:…eogaeaoehlefnkodbefgpgknn/background.js:1:1180209"}
    code: -32603
    message: "[object Object]"
    data:
        code: -32602
        message: "Unknown block number"
    __proto__: Object
    stack: "Error: [object Object]↵    at a (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background.js:1:1159698)↵    at Object.internal (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background.js:1:1159984)↵    at f (chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background.js:1:1180998)↵    at chrome-extension://nkbihfbeogaeaoehlefnkodbefgpgknn/background.js:1:1180209"
    __proto__: Object
```

The development environment blockchain node is being reset every day. It means that all transaction
block numbers will be reset as well. Meta Mask keeps its own record of a transaction made before, so
at some point, the Meta Mask transactions index might get differ with the newly reset development
node. To fix this issue open Meta Mask -> Settings -> Advanced and click on "Reset account". This
will reset Meta Mask transactions index and fix the issue.
