import * as React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";
import { Button } from "./Button";

storiesOf("NeuButton", module).add("default view", () => (
  <View>
    <Button title={"Hello button"} onPress={() => {}} />
  </View>
));
