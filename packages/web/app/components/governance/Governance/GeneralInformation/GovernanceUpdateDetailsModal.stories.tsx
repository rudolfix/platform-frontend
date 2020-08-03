import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { GovernanceUpdateDetailsModal } from "./GovernanceUpdateDetailsModal";

storiesOf("Governance/GeneralInformation", module).add("GovernanceUpdateDetailsModal", () => (
  <GovernanceUpdateDetailsModal
    isOpen
    title="Fifth Force GmbH notice of share capital change"
    date={new Date("2020-04-18T14:17:48.000Z")}
    onClose={action("onModalClose")}
  />
));
