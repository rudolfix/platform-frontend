import { storiesOf } from "@storybook/react";
import * as React from "react";

import { LabelBase } from "./LabelBase";

storiesOf("NDS|Atoms/Inputs/LabelBase", module).add("default", () => (
  <>
    <LabelBase>Lorem ipsum</LabelBase> <br />
    <br />
    <LabelBase isOptional={true}>Lorem Ipsum</LabelBase>
  </>
));
