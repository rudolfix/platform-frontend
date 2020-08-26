import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EGovernanceAction } from "../../../../modules/governance/types";
import { governanceActionToLabel } from "../../../../modules/governance/utils";
import { GovernanceUpdateDetailsModal } from "./GovernanceUpdateDetailsModal";

storiesOf("Governance/GeneralInformation", module).add("GovernanceUpdateDetailsModal", () => (
  <GovernanceUpdateDetailsModal
    title="Fifth Force GmbH notice of share capital change"
    date={new Date("2020-04-18T14:17:48.000Z")}
    onClose={action("onModalClose")}
    documentName={"Governance_update.pdf"}
    documentSize={"25555"}
    documentHash={"Qma7w9sti8z4F1nZDpJC2ZRuKZf8NpCG8YREjDKM6H9A2d"}
    actionName={governanceActionToLabel(EGovernanceAction.COMPANY_NONE, "Nomera GmbH")}
    isOpen={true}
  />
));
