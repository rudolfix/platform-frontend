import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Range } from "./Range";

storiesOf("Range", module)
  .add("default", () => <Range name="name" min={10} max={20} unit="%" />)
  .add("with default value", () => <Range name="name" min={0} max={100} value={70} unit="%" />)
  .add("with different step", () => <Range name="name" min={0} max={12} step={3} unit="px" />)
  .add("with different units", () => (
    <Range name="name" min={1} max={5} unitMin="week" unitMax="weeks" />
  ))
  .add("without unit", () => <Range name="name" min={0} max={10} step={2} />);
