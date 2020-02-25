import { storiesOf } from "@storybook/react";
import * as React from "react";

import { InputDescription } from "./InputDescription";

storiesOf("NDS/Atoms/Inputs/TextField", module).add("InputDescription", () => (
  <InputDescription name="field">Lorem Ipsum...</InputDescription>
));
