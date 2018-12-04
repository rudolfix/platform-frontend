import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ChooseEtoStartDateWidgetComponent } from "./ChooseEtoStartDateWidget";

storiesOf("ETO-Flow/ChooseEtoStartDateWidget", module)
  .add("default", () => (
    <ChooseEtoStartDateWidgetComponent
      setEtoDate={() => {}}
      startDate={new Date("2018-12-24")}
      canChangeDate={true}
    />
  ))
  .add("readonly", () => (
    <ChooseEtoStartDateWidgetComponent
      setEtoDate={() => {}}
      startDate={new Date("2018-12-24")}
      canChangeDate={false}
    />
  ));
