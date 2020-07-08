import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { BankTransferVerifyInfoLayout } from "./BankTransferVerifyAgreement";

const props = {
  goToAgreement: action("goToAgreement"),
  minEuro: "1",
};

storiesOf("BankTransferVerifyAgreement", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferVerifyInfoLayout {...props} />);
