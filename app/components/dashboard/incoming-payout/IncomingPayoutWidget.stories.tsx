import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { IncomingPayoutComponent } from "./IncomingPayoutWidget";

storiesOf("IncomingPayoutWidget", module)
  .add("default", () => (
    <IncomingPayoutComponent
      etherTokenIncomingPayout={"128128120000000000000"}
      euroTokenIncomingPayout={"1.1000012812e+23"}
      incomingPayoutDone={() => action("Payout done")}
      isIncomingPayoutDone={false}
    />
  ))
  .add("payout finished", () => (
    <IncomingPayoutComponent
      etherTokenIncomingPayout={"128128120000000000000"}
      euroTokenIncomingPayout={"1.1000012812e+23"}
      incomingPayoutDone={() => action("Payout done")}
      isIncomingPayoutDone={true}
    />
  ));
