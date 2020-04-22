import { storiesOf } from "@storybook/react";
import * as React from "react";

import { InputDescription } from "./InputDescription";

storiesOf("NDS|Atoms/Input", module).add("InputDescription", () => (
  <InputDescription name="field">Lorem Ipsum...</InputDescription>
));
