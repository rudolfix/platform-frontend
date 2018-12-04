import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ChoosePreEtoDateWidgetComponent } from "./ChoosePreEtoDateWidget";

storiesOf("ETO-Flow/ChoosePreEtoDateWidget", module).add("default", () => (
  <ChoosePreEtoDateWidgetComponent setEtoDate={() => {}} />
));
