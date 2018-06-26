import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PercentageIndicatorBar } from "./PercentageIndicatorBar";

storiesOf("PercentageIndicator (Progress)", module)
  .add("100%", () => <PercentageIndicatorBar percent={100} />)
  .add("77%", () => <PercentageIndicatorBar percent={77} />)
  .add("5%", () => <PercentageIndicatorBar percent={5} />)
  .add("1%", () => <PercentageIndicatorBar percent={1} />)
  .add("empty", () => <PercentageIndicatorBar percent={0} />);
