import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Input } from "./Input";

storiesOf("NDS|Atoms/Input", module).add("Input", () => (
  <>
    <Input placeholder="Normal input placeholder" />
    <br />
    <br />
    <Input value="Normal input value" />
    <br />
    <br />
    <Input autoFocus={true} placeholder="Autofocused input" />
    <br />
    <br />
    <Input type="email" value="Invalid input" />
    <br />
    <br />
    <Input disabled placeholder="Disabled input" />
  </>
));
