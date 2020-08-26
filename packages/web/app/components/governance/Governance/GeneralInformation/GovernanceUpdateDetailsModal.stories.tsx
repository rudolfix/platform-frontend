import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EGovernanceAction, EResolutionState } from "../../../../modules/governance/types";
import { GovernanceUpdateDetailsModal } from "./GovernanceUpdateDetailsModal";

const resolution = {
  resolutionState: EResolutionState.FULL as const,
  title: "Fifth Force GmbH notice of share capital change",
  startedAt: new Date("2020-04-18T14:17:48.000Z"),
  onClose: action("onModalClose"),
  documentName: "Governance_update.pdf",
  documentSize: "25555",
  documentHash: "Qma7w9sti8z4F1nZDpJC2ZRuKZf8NpCG8YREjDKM6H9A2d",
  action: EGovernanceAction.COMPANY_NONE,
  id: "0x642f1abab6a3bf50045490997b35edc3578372c994e8111062968205c0cd1a59",
  draft: false,
};

storiesOf("Governance/GeneralInformation", module).add("GovernanceUpdateDetailsModal", () => (
  <GovernanceUpdateDetailsModal
    resolution={resolution}
    companyBrandName="Nomera Tech"
    isOpen={true}
  />
));
