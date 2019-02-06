import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { withModalBody } from "../../../../utils/storybookHelpers";
import { InvestorPayoutSuccessLayout } from "./Success";

storiesOf("InvestorPayout/Success", module)
  .addDecorator(withModalBody())
  .add("default", () => <InvestorPayoutSuccessLayout goToWallet={action("View Wallet")} />);
