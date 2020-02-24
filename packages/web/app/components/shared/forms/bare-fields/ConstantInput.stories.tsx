import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ConstantInput } from "./ConstantInput";

storiesOf("Core/molecules/ConstantInput", module)
  .add("default", () => <ConstantInput value="test" />)
  .add("with error", () => <ConstantInput value="test" errorMessage={"Value is not valid"} />);
