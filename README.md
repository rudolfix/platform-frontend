[![CircleCI](https://circleci.com/gh/Neufund/platform-frontend.svg?style=svg)](https://circleci.com/gh/Neufund/platform-frontend)
[![Project dependencies Status](https://david-dm.org/Neufund/platform-frontend/status.svg)](https://david-dm.org/Neufund/platform-frontend)
[![Project devDependencies Status](https://david-dm.org/Neufund/platform-frontend/dev-status.svg)](https://david-dm.org/Neufund/platform-frontend?type=dev)

A monorepo of neufund frontend.

## packages

 - [web](https://github.com/Neufund/platform-frontend/packages/web) - web UI deployed on `platform.neufund.org`;
 - more coming soon...

## scripts

### `yarn deduplicate` 

Removes duplicated transitive dependencies. Run after major dependencies upgrade to clean up `node_modules`.

Under the hood uses [`yarn-deduplicate`](https://github.com/atlassian/yarn-deduplicate)
package.
