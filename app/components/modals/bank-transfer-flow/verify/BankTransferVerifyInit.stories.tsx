import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import {
  BankTransferVerifyAgreementLayout,
  BankTransferVerifyInfoLayout,
} from "./BankTransferVerifyInit";

const props = {
  goToSummary: action("goToSummary"),
  downloadNEurTokenAgreement: action("downloadNEurTokenAgreement"),
  goToAgreement: action("goToAgreement"),
};

storiesOf("BankTransferVerifySuccess", module)
  .addDecorator(withModalBody())
  .add("INFO", () => <BankTransferVerifyInfoLayout {...props} />)
  .add("AGREEMENT", () => <BankTransferVerifyAgreementLayout {...props} />);
