import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ModalComponentBody } from "../../ModalComponentBody";
import { SetEtoDateSummaryComponent } from "./SetDateSummary";

const data = {
  etoTermsAddress: "0x456456",
  equityTokenAddress: "0x123123",
  equityTokenAgreementIPFSLink: "https://ipfs.io/123123",
  etoCommitmentAddress: "0x789789",
  etoCommitmentAgreementIPFSLink: "https://ipfs.io/789789",
  newDate: new Date("2018-12-24"),
  onAccept: () => {},
};

storiesOf("ETO-Flow/SetStartDateSummary", module)
  .addDecorator(story => (
    <div style={{ maxWidth: "37.5rem" }}>
      <ModalComponentBody onClose={() => {}}>{story()}</ModalComponentBody>
    </div>
  ))
  .add("default", () => <SetEtoDateSummaryComponent {...data} />);
