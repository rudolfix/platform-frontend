import * as React from "react";
import { storiesOf } from "@storybook/react-native";

import { ErrorMessage } from "./ErrorMessage";

storiesOf("Atoms|ErrorMessage", module).add("default", () => (
  <>
    <ErrorMessage>Lorem ipsum...</ErrorMessage>
  </>
));
