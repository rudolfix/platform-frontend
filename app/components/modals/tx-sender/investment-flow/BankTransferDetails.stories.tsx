import { storiesOf } from "@storybook/react";
import * as React from "react";

import { BankTransferDetailsComponent } from "./BankTransferDetails";

storiesOf("BankTransferDetails", module).add("default", () => (
  <BankTransferDetailsComponent
    accountName={"accountName"}
    country={"DE"}
    recipient={"recipient"}
    iban={"asdfasdf12433w454w6756r7124345645365435345"}
    bic={"asdf23536"}
    referenceCode={"abdsidsndsikdsidsnds"}
    amount={"1234578789798676234234"}
    gasStipend={true}
    onGasStipendChange={() => {}}
    handleCheckbox={() => {}}
  />
));
