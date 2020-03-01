# Button API

## Import

```js
import {
  Button,
  EButtonLayout,
  EButtonSize,
  EButtonWidth,
  EIconPosition,
} from "@neufund/design-system";
```

## Usage

```jsx
<Button>Click Me</Button>
```

## Props

| Prop Name    | Type          | One of                                   | Default Value         |
| ------------ | ------------- | ---------------------------------------- | --------------------- |
| layout       | EButtonLayout | PRIMARY \| SECONDARY \| OUTLINE \| GHOST | EButtonLayout.OUTLINE |
| size         | EButtonSize   | NORMAL \| SMALL \| HUGE \| DYNAMIC       | EButtonSize.NORMAL    |
| width        | EButtonWidth  | NORMAL \| BLOCK \| NO_PADDING            | EButtonWidth.NORMAL   |
| onClick      | function      |                                          |                       |
| className    | string        |                                          |                       |
| children\*   | ReactElement  |                                          |                       |
| disabled     | boolean       |                                          |                       |
| svgIcon      | string        |                                          |                       |
| iconPosition | EIconPosition | ICON_BEFORE                              | ICON_AFTER            |  |
| iconProps    | object        |                                          |                       |
| type         | string        |                                          |                       |
| isLoading    | boolean       |                                          |                       |
