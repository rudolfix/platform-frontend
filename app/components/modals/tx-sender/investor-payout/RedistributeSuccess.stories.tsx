import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/storybookHelpers";
import { InvestorRedistributePayoutSuccessLayout } from "./RedistributeSuccess";

storiesOf("InvestorPayout/RedistributeSuccess", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <InvestorRedistributePayoutSuccessLayout goToPortfolio={action("View Portfolio")} />
  ));
