import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoFormProgressWidget } from "./EtoFormProgressWidget";

storiesOf("EtoFormProgressWidget", module)
  .add("edit", () => <EtoFormProgressWidget to={"/test"} name="test long name" progress={1} />)
  .add("complete", () => (
    <EtoFormProgressWidget to={"/test"} name="test long name" progress={0.88} />
  ));
