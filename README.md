[![CircleCI](https://circleci.com/gh/Neufund/platform-frontend.svg?style=svg)](https://circleci.com/gh/Neufund/platform-frontend)

![Neufund logo](https://neufund.org/img/logo-neufund.svg)

A monorepo of Neufund frontend.

## packages

 - [web](./packages/web) - web UI deployed on `platform.neufund.org`
 - [design-system](./packages/design-system) - shared UI components, icons and styles
 - [wallet](./packages/wallet) - mobile wallet app for iOS & Android
 - [shared-utils](./packages/shared-utils) - shared utilities
 - [shared-modules](./packages/shared-modules) - shared business logic
 - [sagas](./packages/sagas) - saga effects and utilities

## scripts

### `yarn deduplicate`

Removes duplicated transitive dependencies. Run after major dependencies upgrade to clean up `node_modules`.

Under the hood uses [`yarn-deduplicate`](https://github.com/atlassian/yarn-deduplicate)
package.

## Docs

- [Component Development Guidelines](./docs/component-development-guidelines.md)
- [React Guidelines](./docs/react-guidelines.md)
- [Testing production build](./docs/testing-prod-build.md)
- [Working with Intl](./docs/working-with-intl.md)
- [Feature flags](./docs/feature-flags.md)
- [Security Policy](./SECURITY.md)
- [E2E visual regression](./docs/e2e-visual-regression.md)
