import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { Text } from "react-native";

import { Shadow2 } from "./Shadow";

storiesOf("Atoms|Shadow", module).add("shadow 2", () => (
  <Shadow2>
    <Text>Content</Text>
  </Shadow2>
));
