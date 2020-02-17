import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { AddPersonButton } from "./AddPersonButton";

storiesOf("molecules|KYC/AddPersonButton", module).add("default", () => (
  <AddPersonButton onClick={action("CLICK")} dataTestId="">
    Add Managing Director
  </AddPersonButton>
));
