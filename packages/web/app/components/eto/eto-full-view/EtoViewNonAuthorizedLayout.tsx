import * as React from "react";

import { TEtoViewData } from "../../../modules/eto-view/shared/types";
import { CoverBanner } from "./shared/cover-banner/CoverBanner";
import { EtoViewLayout } from "./shared/EtoViewLayout";
import { initEtoViewLayout } from "./shared/initEtoViewLayout";

const EtoViewNonAuthorizedLayout: React.FunctionComponent<TEtoViewData> = ({
  eto,
  userIsFullyVerified,
  campaignOverviewData,
}) => (
  <EtoViewLayout
    eto={eto}
    userIsFullyVerified={userIsFullyVerified}
    campaignOverviewData={campaignOverviewData}
    publicView={true}
  >
    <CoverBanner
      jurisdiction={eto.product.jurisdiction}
      etoStateOnChain={eto.contract?.timedState}
      etoState={eto.state}
    />
  </EtoViewLayout>
);

const EtoViewNonAuthorized = initEtoViewLayout(EtoViewNonAuthorizedLayout);
export { EtoViewNonAuthorizedLayout, EtoViewNonAuthorized };
