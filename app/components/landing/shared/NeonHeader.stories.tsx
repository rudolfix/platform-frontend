import { storiesOf } from "@storybook/react";
import * as React from "react";

import { NeonHeader } from "./NeonHeader";

storiesOf("NeonHeader", module).add("Default", () => (
  <NeonHeader>Lorem ipsum dolor sit amet</NeonHeader>
));
