# Neufund Design System

UI components, icons and styles for the Neufund Design System.

## Usage

- Add `@neufund/design-system` as a dependency to your package which exists in the Neufund
  workspace.
- importing a component:

```js
import { Button } from "@neufund/design-system";
```

- importing styles:

```
/* All styles are in dist/styles dir */
@import "~@neufund/design-system/dist/styles/bootstrap";

/* To import the whole theme */
@import "~@neufund/design-system/dist/styles/neufund-theme";
```

## To build

```shell script
yarn build
```

## To run StoryBook

```shell script
yarn storybook
```
