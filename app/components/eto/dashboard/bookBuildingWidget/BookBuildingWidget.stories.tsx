import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dummyIntl } from "../../../../utils/injectIntlHelpers.fixtures";

import { BookBuildingWidgetComponent } from "./BookBuildingWidget";

const data = {
  startBookBuilding:() => {},
  stopBookBuilding:() => {},
  intl:dummyIntl
}

storiesOf("BookBuildingWidget", module)
  .add("start book-building", () => (
    <BookBuildingWidgetComponent {...{...data, bookBuildingState:true}}/>
  ))
  .add("stop book-building", () => (
    <BookBuildingWidgetComponent {...{...data, bookBuildingState:false}}/>
  ));
