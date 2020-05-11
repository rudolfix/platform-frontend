import * as React from "react";
import { storiesOf } from "@storybook/react-native";

import { HelperText } from "./HelperText";

storiesOf("Atoms|HelperText", module).add("default", () => (
  <>
    <HelperText>Lorem ipsum...</HelperText>
  </>
));
