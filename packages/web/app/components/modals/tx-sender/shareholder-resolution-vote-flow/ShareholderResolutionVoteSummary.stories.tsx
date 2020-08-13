import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { ShareholderResolutionVoteSummaryLayout } from "./ShareholderResolutionVoteSummary";

const additionalData = {
  voteInFavor: true,
  proposalTitle: "Eto proposal title",
  companyName: "My awesome company",
  gasCost: "1000000",
  gasCostEur: "1000.12",
};

storiesOf("Templates|Shareholder Resolution Vote Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <ShareholderResolutionVoteSummaryLayout
      onAccept={action("onAccept")}
      additionalData={additionalData}
    />
  ));
