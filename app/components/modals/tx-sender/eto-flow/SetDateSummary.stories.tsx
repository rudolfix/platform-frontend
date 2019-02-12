import { storiesOf } from "@storybook/react";
import * as moment from "moment-timezone";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { SetEtoDateSummaryComponent } from "./SetDateSummary";

const date = moment(new Date()).add(10, "days");
const changeableTill = date.clone().subtract(3, "days");

const data = {
  etoTermsAddress: "0x456456",
  equityTokenAddress: "0x123123",
  offeringAgreementIPFSLink: "https://ipfs.io/123123",
  etoCommitmentAddress: "0x789789",
  termsAgreementIPFSLink: "https://ipfs.io/789789",
  newDate: date.toDate(),
  onAccept: () => {},
  changeableTill,
};

storiesOf("ETO-Flow/SetStartDateSummary", module)
  .addDecorator(withModalBody())
  .add("default", () => <SetEtoDateSummaryComponent {...data} />);
