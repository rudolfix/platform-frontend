import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Toggle } from "./Toggle";

storiesOf("Toggle", module)
  .add("default", () => (
    <Toggle enabledLabel="on" disabledLabel="off" checked={true} onClick={() => {}} />
  ))
  .add("disabled", () => (
    <Toggle enabledLabel="on" disabledLabel="off" checked={true} onClick={() => {}} disabled />
  ))
