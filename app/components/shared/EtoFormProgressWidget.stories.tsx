import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoFormProgressWidgetComponent } from "./EtoFormProgressWidget";

storiesOf("EtoFormProgressWidget", module)
  .add("loading", () => (
    <EtoFormProgressWidgetComponent
      to="/test"
      name="test long name"
      isLoading={true}
      disabled={false}
      readonly={false}
      progress={1}
    />
  ))
  .add("edit", () => (
    <EtoFormProgressWidgetComponent
      to="/test"
      name="test long name"
      isLoading={false}
      readonly={false}
      disabled={false}
      progress={1}
    />
  ))
  .add("complete", () => (
    <EtoFormProgressWidgetComponent
      to="/test"
      name="test long name"
      progress={0.88}
      isLoading={false}
      disabled={false}
      readonly={false}
    />
  ))
  .add("readonly", () => (
    <EtoFormProgressWidgetComponent
      to="/test"
      name="test long name"
      progress={0.88}
      isLoading={false}
      disabled={false}
      readonly={true}
    />
  ));
