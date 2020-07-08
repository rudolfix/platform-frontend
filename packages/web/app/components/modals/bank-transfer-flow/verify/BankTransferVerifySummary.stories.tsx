import { convertFromUlps } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { BankTransferVerifySummaryLayout } from "./BankTransferVerifySummary";

const detailsData = {
  quintessenceBankAccount: {
    name: "Fifth Force GmbH",
    bankAccountNumber: "DE1250094039446384529400565",
    swiftCode: "TLXXXXXXXXX",
    isSepa: false,
    bankName: "ING",
  },
  referenceCode: "NF AGHGCmR3u2SuxdyNPIksxTyAhKM REF 123456789011",
  minAmount: convertFromUlps("123456781234567812345678").toString(),
  continueToSuccess: action("continueToSuccess"),
};

storiesOf("BankTransferVerifySummary", module)
  .addDecorator(withModalBody())
  .add("default", () => <BankTransferVerifySummaryLayout {...detailsData} />);
