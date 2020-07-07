import { EKycRequestType } from "@neufund/shared-modules";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { KycSuccessLayout } from "./Success";

storiesOf("molecules|KYC/Success", module).add("Individual", () => (
  <KycSuccessLayout
    requestType={EKycRequestType.INDIVIDUAL}
    goToPersonalAddAdditional={action("GO_TO_PERSONAL_ADDITIONAL")}
    goToBusinessAddAdditional={action("GO_TO_BUSINESS_ADDITIONAL")}
    goToDashboard={action("GO_TO_DASHBOARD")}
  />
));
