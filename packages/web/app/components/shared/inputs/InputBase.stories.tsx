import { storiesOf } from "@storybook/react";
import * as React from "react";

import { InputBase } from "./InputBase";

storiesOf("NDS/Atoms/Inputs/TextField", module).add("InputBase", () => (
  <>
    <InputBase value="Normal input" />
    <br />
    <br />
    <InputBase autoFocus value="Autofocused input" />
    <br />
    <br />
    <InputBase disabled value="disabled input" />
  </>
));
