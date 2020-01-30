import { storiesOf } from "@storybook/react";
import * as React from "react";

import { InputError } from "./InputError";

storiesOf("NDS|Atoms/Inputs/InputError", module).add("default", () => (
  <InputError name="field">Lorem Errorum...</InputError>
));
