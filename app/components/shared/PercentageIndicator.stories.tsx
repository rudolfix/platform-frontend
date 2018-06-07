import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PercentageIndicatorBar } from "./PercentageIndicatorBar";

storiesOf("PercentageIndicator (Progress)", module)
  .add("default", () => <PercentageIndicatorBar percent={77} />)
  .add("empty", () => <PercentageIndicatorBar percent={0} />);
