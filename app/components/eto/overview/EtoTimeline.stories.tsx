import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoTimeline } from "./EtoTimeline";

const day = 86400000;
const etoStartDate = Date.now() - 20 * day;
const bookBuildingEndDate = etoStartDate + 7 * day;
const whitelistedEndDate = bookBuildingEndDate + 7 * day;
const publicEndDate = whitelistedEndDate + 7 * day;
const inSigningEndDate = publicEndDate + 7 * day;
const etoEndDate = inSigningEndDate + 7 * day;

const bookBuildingProps = {
  etoStartDate: Date.now() - 2 * day,
  bookBuildingEndDate: Date.now() + 7 * day,
  whitelistedEndDate: Date.now() + 14 * day,
  publicEndDate: Date.now() + 21 * day,
  inSigningEndDate: Date.now() + 28 * day,
  etoEndDate: Date.now() + 35 * day,
}

const whitelistedProps = {
  etoStartDate: Date.now() - 30 * day,
  bookBuildingEndDate: Date.now() - 20 * day,
  whitelistedEndDate: Date.now() + 14 * day,
  publicEndDate: Date.now() + 21 * day,
  inSigningEndDate: Date.now() + 28 * day,
  etoEndDate: Date.now() + 35 * day,
}

const publicProps = {
  etoStartDate: Date.now() - 10 * day,
  bookBuildingEndDate: Date.now() - 6 * day,
  whitelistedEndDate: Date.now() - 1 * day,
  publicEndDate: Date.now() + 2 * day,
  inSigningEndDate: Date.now() + 12 * day,
  etoEndDate: Date.now() + 10 * day,
}

const inSigningProps = {
  etoStartDate: Date.now() - 20 * day,
  bookBuildingEndDate: Date.now() - 10 * day,
  whitelistedEndDate: Date.now() - 5 * day,
  publicEndDate: Date.now() - 2 * day,
  inSigningEndDate: Date.now() + 4 * day,
  etoEndDate: Date.now() + 10 * day,
}

const payOffProps = {
  etoStartDate: Date.now() - 20 * day,
  bookBuildingEndDate: Date.now() - 10 * day,
  whitelistedEndDate: Date.now() - 8 * day,
  publicEndDate: Date.now() - 5 * day,
  inSigningEndDate: Date.now() - 3 * day,
  etoEndDate: Date.now() - 500 * day,
}

storiesOf("EtoTimeline", module)
  .add("book building", () => (
    <EtoTimeline
      {...bookBuildingProps}
      status="book-building"
    />
  ))
  .add("whitelisted", () => (
    <EtoTimeline
      {...whitelistedProps}
      status="whitelisted"
    />
  ))
  .add("public", () => (
    <EtoTimeline
      {...publicProps}
      status="public"
    />
  ))
  .add("in signing", () => (
    <EtoTimeline
      {...inSigningProps}
      status="in-signing"
    />
  ))
  .add("pay off", () => (
    <EtoTimeline
      {...payOffProps}
      status="pay-off"
    />
  ));
