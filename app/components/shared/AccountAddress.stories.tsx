import { storiesOf } from "@storybook/react";
import * as React from "react";

import { AccountAddress } from "./AccountAddress";

storiesOf("AccountAddress", module).add("default", () => (
  <AccountAddress address="asdfghjklzxcvbnmqwertyuiop" />
));
