import * as React from "react";
import { storiesOf } from "@storybook/react-native";
import { View } from "react-native";

import { HelperText } from "./HelperText";

storiesOf("Atoms|HelperText", module)
  .addDecorator((story: () => React.ReactNode) => <View style={{ padding: 20 }}>{story()}</View>)
  .add("default", () => (
    <>
      <HelperText>Lorem ipsum...</HelperText>
    </>
  ));
