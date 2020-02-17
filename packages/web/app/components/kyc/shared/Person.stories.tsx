import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Person } from "./Person";

storiesOf("molecules|KYC/Person", module).add("default", () => (
  <Person onClick={action("CLICK")} name="John Doe" />
));
