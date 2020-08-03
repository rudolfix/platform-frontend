import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { GovernanceUpdateModal } from "./GovernanceUpdateModal";

storiesOf("Governance/GeneralInformation", module).add("GovernanceUpdateModal", () => (
  <GovernanceUpdateModal isOpen onClose={action("onModalClose")} onPublish={action("onPublish")} />
));
