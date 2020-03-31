import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { View } from "react-native";

import { Link } from "./Link";

storiesOf("Atoms|Link", module).add("default", () => (
  <View style={{ padding: 20 }}>
    <Link url="https://google.com">Open google</Link>
  </View>
));
