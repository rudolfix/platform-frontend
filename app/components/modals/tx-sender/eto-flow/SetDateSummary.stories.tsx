import { storiesOf } from "@storybook/react";
import * as moment from "moment";
import * as React from "react";

import { ModalComponentBody } from "../../ModalComponentBody";
import { SetEtoDateSummaryComponent } from "./SetDateSummary";

const date = moment(new Date()).add(10, "days");
const changableTill = date.clone().subtract(3, "days");

const data = {
  etoTermsAddress: "0x456456",
  equityTokenAddress: "0x123123",
  offeringAgreementIPFSLink: "https://ipfs.io/123123",
  etoCommitmentAddress: "0x789789",
  termsAgreementIPFSLink: "https://ipfs.io/789789",
  newDate: date.toDate(),
  onAccept: () => {},
  changableTill,
};

storiesOf("ETO-Flow/SetStartDateSummary", module)
  .addDecorator(story => (
    <div style={{ maxWidth: "37.5rem" }}>
      <ModalComponentBody onClose={() => {}}>{story()}</ModalComponentBody>
    </div>
  ))
  .add("default", () => <SetEtoDateSummaryComponent {...data} />);
