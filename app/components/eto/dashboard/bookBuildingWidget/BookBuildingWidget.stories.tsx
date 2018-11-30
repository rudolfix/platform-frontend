import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dummyIntl } from "../../../../utils/injectIntlHelpers.fixtures";

import { BookBuildingWidgetComponent } from "./BookBuildingWidget";

const data = {
  startBookBuilding: () => {},
  stopBookBuilding: () => {},
  downloadCSV: ()=>{},
  bookBuildingEnabled:false,
  bookBuildingStats: [],
  maxPledges: 500
};

const pledge1 = {
  amountEur: 55562,
  consentToRevealEmail: true,
  currency: "blablacoin",
  email: "adsflasdf@asdfasdf.ru",
  etoId: "12312345345457567",
  insertedAt: "2018-11-30T10:24:38.394206Z",
  updatedAt: "2018-11-30T10:24:38.394216Z",
  userId: "1123412123",
};

const pledge2 = {
  amountEur: 1245567,
  consentToRevealEmail: false,
  currency: "blablacoin",
  etoId: "12312345345457567",
  insertedAt: "2018-11-30T10:24:38.394206Z",
  updatedAt: "2018-11-30T10:24:38.394216Z",
  userId: "12341234123",
};


storiesOf("BookBuildingWidget", module)
  .add("whitelisting not started", () => {
    return (
      <BookBuildingWidgetComponent {...data}/>
    )
  })
  .add("whitelisting started, no data yet", () => {
    const testData = {
      ...data,
      bookBuildingEnabled: true
    };
    return (
      <BookBuildingWidgetComponent {...testData}/>
    )
  })
  .add("whitelisting started, there are pledges", () => {
    const testData = {
      ...data,
      bookBuildingEnabled: true,
      bookBuildingStats: [pledge1, pledge2]
    };
    return (
      <BookBuildingWidgetComponent {...testData}/>
    )
  })
  .add("whitelisting paused", () => {
    const testData = {
      ...data,
      bookBuildingEnabled: false,
      bookBuildingStats: [pledge1, pledge2]
    };
    return (
      <BookBuildingWidgetComponent {...testData}/>
    )
  });
