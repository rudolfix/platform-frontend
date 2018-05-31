import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Checkbox } from "./Checkbox";

storiesOf("Checkbox", module)
  .add("checkbox", () => <Checkbox type="checkbox" label="checkbox's label" />)
  .add("radio", () => (
    <>
      <Checkbox type="radio" label="checkbox's label" name="radio" />
      <Checkbox type="radio" label="checkbox's label" name="radio" />
      <Checkbox type="radio" label="checkbox's label" name="radio" />
      <Checkbox type="radio" label="checkbox's label" name="radio" />
    </>
  ));
