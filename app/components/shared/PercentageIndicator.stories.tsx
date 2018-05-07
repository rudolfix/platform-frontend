// tslint:disable-next-line:no-implicit-dependencies
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PercentageIndicatorBar } from "./PercentageIndicatorBar";

storiesOf("PercentageIndicator", module).add("default", () => (
  <PercentageIndicatorBar percent={77} />
));
