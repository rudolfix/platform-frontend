import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dummyIntl } from "../../../../utils/injectIntlHelpers.fixtures";

import { BookBuildingWidgetComponent } from "./BookBuildingWidget";

storiesOf("BookBuildingWidget", module)
  .add("start book-building", () => (
    <BookBuildingWidgetComponent
      startBookBuilding={() => {}}
      stopBookBuilding={() => {}}
      bookBuildingState={true}
      intl={dummyIntl}
    />
  ))
  .add("stop book-building", () => (
    <BookBuildingWidgetComponent
      startBookBuilding={() => {}}
      stopBookBuilding={() => {}}
      bookBuildingState={false}
      intl={dummyIntl}
    />
  ));
