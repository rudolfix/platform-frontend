import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Toggle } from "./Toggle";

storiesOf("Toggle", module)
  .add("on", () => (
    <Toggle enabledLabel="on" disabledLabel="off" checked={true} onClick={() => {}} />
  ))
  .add("off", () => (
    <Toggle enabledLabel="on" disabledLabel="off" checked={false} onClick={() => {}} />
  ))
  .add("disabled on", () => (
    <Toggle enabledLabel="on" disabledLabel="off" checked={true} onClick={() => {}} disabled />
  ))
  .add("disabled off", () => (
    <Toggle enabledLabel="on" disabledLabel="off" checked={false} onClick={() => {}} disabled />
  ));
