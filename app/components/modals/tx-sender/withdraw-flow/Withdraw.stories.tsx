import { storiesOf } from "@storybook/react";
import * as React from "react";
import { dummyIntl } from "../../../../utils/injectIntlHelpers.fixtures";
import { WithdrawLayout } from "./Withdraw";

storiesOf("Withdraw", module).add("default", () => (
  <WithdrawLayout
    onAccept={() => {}}
    maxEther={"100000000000000000000000000000"}
    onValidateHandler={() => {}}
    intl={dummyIntl}
  />
));
