import { storiesOf } from "@storybook/react";
import * as React from "react";

import { LabelBase } from "./LabelBase";

storiesOf("NDS/Atoms/Inputs/TextField", module).add("LabelBase", () => (
  <>
    <LabelBase>Lorem ipsum</LabelBase> <br />
    <br />
    <LabelBase isOptional={true}>Lorem Ipsum</LabelBase>
  </>
));
