import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TextInput } from "./TextInput";

storiesOf("NDS|Atoms/Inputs/TextInput", module).add("default", () => (
  <>
    <TextInput placeholder="Normal input placeholder" />
    <br />
    <br />
    <TextInput value="Normal input value" />
    <br />
    <br />
    <TextInput autoFocus={true} placeholder="Autofocused input" />
    <br />
    <br />
    <TextInput type="email" value="Invalid input" />
    <br />
    <br />
    <TextInput disabled placeholder="Disabled input" />
  </>
));
