import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { ShareholderResolutionVoteSetupSummaryLayout } from "./ShareholderResolutionVoteSetupSummary";

storiesOf("Templates|Shareholder Resolution Vote Setup Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <ShareholderResolutionVoteSetupSummaryLayout
      onAccept={action("onAccept")}
    />
  ));
