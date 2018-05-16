import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoTimeline } from "./EtoTimeline";

const day = 86400000;
const etoStartDate = Date.now();
const bookBuildingEndDate = etoStartDate + 7 * day;
const whitelistedEndDate = bookBuildingEndDate + 7 * day;
const publicEndDate = whitelistedEndDate + 7 * day;
const inSigningEndDate = publicEndDate + 7 * day;
const etoEndDate = inSigningEndDate + 7 * day;

storiesOf("EtoTimeline", module)
  .add("book building", () => (
    <EtoTimeline
      bookBuildingEndDate={bookBuildingEndDate}
      whitelistedEndDate={whitelistedEndDate}
      publicEndDate={publicEndDate}
      inSigningEndDate={inSigningEndDate}
      etoStartDate={etoStartDate}
      etoEndDate={etoEndDate}
      status="book-building"
    />
  ))
  .add("whitelisted", () => (
    <EtoTimeline
      bookBuildingEndDate={bookBuildingEndDate}
      whitelistedEndDate={whitelistedEndDate}
      publicEndDate={publicEndDate}
      inSigningEndDate={inSigningEndDate}
      etoStartDate={etoStartDate}
      etoEndDate={etoEndDate}
      status="whitelisted"
    />
  ))
  .add("public", () => (
    <EtoTimeline
      bookBuildingEndDate={bookBuildingEndDate}
      whitelistedEndDate={whitelistedEndDate}
      publicEndDate={publicEndDate}
      inSigningEndDate={inSigningEndDate}
      etoStartDate={etoStartDate}
      etoEndDate={etoEndDate}
      status="public"
    />
  ))
  .add("in signing", () => (
    <EtoTimeline
      bookBuildingEndDate={bookBuildingEndDate}
      whitelistedEndDate={whitelistedEndDate}
      publicEndDate={publicEndDate}
      inSigningEndDate={inSigningEndDate}
      etoStartDate={etoStartDate}
      etoEndDate={etoEndDate}
      status="in-signing"
    />
  ))
  .add("pay off", () => (
    <EtoTimeline
      bookBuildingEndDate={bookBuildingEndDate}
      whitelistedEndDate={whitelistedEndDate}
      publicEndDate={publicEndDate}
      inSigningEndDate={inSigningEndDate}
      etoStartDate={etoStartDate}
      etoEndDate={etoEndDate}
      status="pay-off"
    />
  ));
