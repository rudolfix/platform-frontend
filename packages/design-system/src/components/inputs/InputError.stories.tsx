import { storiesOf } from "@storybook/react";
import * as React from "react";

import { InputError } from "./InputError";

storiesOf("NDS|Atoms/Input", module).add("InputError", () => (
  <InputError name="field">Lorem Errorum...</InputError>
));
