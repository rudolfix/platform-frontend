import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ChooseEtoStartDateWidgetComponent } from "./ChooseEtoStartDateWidget";

const data = {
  setEtoDate: () => {},
  uploadDate: () => {},
  minOffsetPeriodInDays: "7",
};

storiesOf("ETO-Flow/ChooseEtoStartDateWidget", module)
  .add("default", () => (
    <ChooseEtoStartDateWidgetComponent
      {...data}
      oldDate={new Date("2018-12-20")}
      newDate={new Date("2018-12-24")}
      canChangeDate={true}
      isNewDateValid={false}
    />
  ))
  .add("readonly", () => (
    <ChooseEtoStartDateWidgetComponent
      {...data}
      oldDate={new Date("2018-12-24")}
      canChangeDate={false}
    />
  ));
