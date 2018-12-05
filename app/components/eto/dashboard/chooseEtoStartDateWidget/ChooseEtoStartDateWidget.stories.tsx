import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ChooseEtoStartDateWidgetComponent } from "./ChooseEtoStartDateWidget";

const data = {
  setEtoDate: () => {},
  uploadDate: () => {},
};

storiesOf("ETO-Flow/ChooseEtoStartDateWidget", module)
  .add("default", () => (
    <ChooseEtoStartDateWidgetComponent
      {...data}
      startDate={new Date("2018-12-24")}
      canChangeDate={true}
    />
  ))
  .add("readonly", () => (
    <ChooseEtoStartDateWidgetComponent
      {...data}
      startDate={new Date("2018-12-24")}
      canChangeDate={false}
    />
  ));
