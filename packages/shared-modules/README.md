# Shared Modules

[![Project dependencies Status](https://david-dm.org/Neufund/platform-frontend/status.svg?path=packages/shared-modules)](https://david-dm.org/Neufund/platform-frontend?path=packages/shared-modules)
[![Project devDependencies Status](https://david-dm.org/Neufund/platform-frontend/dev-status.svg?path=packages/shared-modules)](https://david-dm.org/Neufund/platform-frontend?type=dev&path=packages/shared-modules)

Shared modules for use between web and mobile apps.

## Module Design

Each module should function as an independent unit with no direct dependency on other modules

### Reducer

A reducer should hold the internal state of the module only. The reducer shouldn't react to any
external actions outside of the actions defined in the module.

### Actions

A set of actions that will either trigger a state change and/or trigger a listening saga. using
`takeEvery` for example.

### Sagas

Sagas should generally be split into two categories:

- Internal sagas that should run only internal and will never get exposed. Only the module is can
  use these sagas

- External sagas, these exposed sagas should be in effect with actions the main interface to
  interact with this module.

### Selectors

Selectors should be used only for data fetching and by no way should convert the data in anyway from
the reducer except in clear cases where the data needs to be normalized before use. If that is the
case the selector should have a clear comment with what is the original data form and what is the
data being normalized to.

### Utility methods

Some modules will need to use utility methods in order to run operations. Utilities should only be
used internally. If more than one module ends up using the same utility method the method should be
moved to `shared-util` package

### constants

All constants should be defined in the constant file. constants can be exposed externally.

internal sagas that shouldn't be exposed and external sagas that should be the main method of
communication with the module externally.

## Running project

```sh
yarn start
```

Will compile and start watching for changes in library.

## Running tests

```
yarn test
```

### Fix all autofixable errors

```
yarn lint:fix
```

### Production build

```
yarn build
```
