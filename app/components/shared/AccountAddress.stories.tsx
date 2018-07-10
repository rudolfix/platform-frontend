import { storiesOf } from "@storybook/react";
import * as React from "react";

import { AccountAddress } from "./AccountAddress";

const image = {
  srcSet: {
    "1x": "",
    "2x": "",
    "3x": "",
  },
  alt: "",
};

storiesOf("AccountAddress", module).add("default", () => (
  <AccountAddress address="asdfghjklzxcvbnmqwertyuiop" avatar={image} />
));
