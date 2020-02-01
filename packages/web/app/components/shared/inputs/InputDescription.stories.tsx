import { storiesOf } from "@storybook/react";
import * as React from "react";

import { InputDescription } from "./InputDescription";

storiesOf("NDS|Atoms/Inputs/InputDescription", module).add("default", () => (
  <InputDescription name="field">Lorem Ipsum...</InputDescription>
));
