import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dummyIntl } from "../../../../utils/injectIntlHelpers.fixtures";

import { ChoosePreEtoDateWidgetComponent } from "./ChoosePreEtoDateWidget";

storiesOf("ChoosePreEtoDateWidget", module).add("default", () => (
  <ChoosePreEtoDateWidgetComponent setEtoDate={() => {}} intl={dummyIntl} />
));
