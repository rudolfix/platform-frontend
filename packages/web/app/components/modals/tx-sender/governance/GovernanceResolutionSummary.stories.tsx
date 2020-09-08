import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { governanceModuleApi, EGovernanceAction } from "../../../../modules/governance/module";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { GovernanceResolutionSummaryBase } from "./GovernanceResolutionSummary";

storiesOf("Templates|Governance Resolution Summary", module)
  .addDecorator(withModalBody())
  .add("default", () => (
    <GovernanceResolutionSummaryBase
      additionalData={{
        documentTitle: "Fifth Force GmbH financials 2020 for investors.pdf",
        type: governanceModuleApi.utils.governanceActionToLabel(EGovernanceAction.NONE, "Neufund"),
      }}
      onAccept={action("onAccept")}
    />
  ));
