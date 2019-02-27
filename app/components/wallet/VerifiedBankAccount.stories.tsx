import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { VerifiedBankAccountComponent } from "./VerifiedBankAccount";

storiesOf("VerifiedBankAccount", module)
  .add("not verified", () => (
    <VerifiedBankAccountComponent onVerify={action("onVerify")} isVerified={false} />
  ))
  .add("verified", () => (
    <VerifiedBankAccountComponent
      onVerify={action("onVerify")}
      isVerified={true}
      bankAccount={{
        hasBankAccount: true,
        details: { bankAccountNumberLast4: "1234", holderName: "Lorem Ipsum" },
      }}
    />
  ))
  .add("with border", () => (
    <VerifiedBankAccountComponent
      onVerify={action("onVerify")}
      isVerified={true}
      withBorder={true}
      bankAccount={{
        hasBankAccount: true,
        details: { bankAccountNumberLast4: "1234", holderName: "Lorem Ipsum" },
      }}
    />
  ));
