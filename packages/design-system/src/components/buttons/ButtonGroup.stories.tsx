import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Button } from "./Button";
import { ButtonGroup } from "./ButtonGroup";

storiesOf("NDS|Atoms/Button", module).add("ButtonGroup", () => (
  <ButtonGroup>
    <Button>First button</Button>
    <Button>Second button</Button>
    <Button>Third button</Button>
  </ButtonGroup>
));
