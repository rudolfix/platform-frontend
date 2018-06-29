import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoFormProgressWidget } from "./EtoFormProgressWidget";

storiesOf("EtoFormProgressWidget", module)
  .add("loading", () => (
    <EtoFormProgressWidget to="/test" name="test long name" isLoading={true} progress={1} />
  ))
  .add("edit", () => (
    <EtoFormProgressWidget to="/test" name="test long name" isLoading={false} progress={1} />
  ))
  .add("complete", () => (
    <EtoFormProgressWidget to="/test" name="test long name" progress={0.88} isLoading={false} />
  ));
