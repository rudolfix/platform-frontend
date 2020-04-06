import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { View } from "react-native";

import { LineBreak } from "./LineBreak";

storiesOf("Atoms|LineBreak", module).add("default", () => (
  <View style={{ borderWidth: 0.5, borderColor: "gray", borderStyle: "dashed" }}>
    <LineBreak />
  </View>
));
