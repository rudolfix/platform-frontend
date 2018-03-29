import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { kycRoutes } from "./routes";

import { KYCStart } from "./start/Start";

// private
import { KYCBeneficialOwners } from "./business/BeneficialOwners";
import { KycBusinessData } from "./business/BusinessData";
import { KycLegalRepresentative } from "./business/LegalRepresentative";
import { KycBusinessStart } from "./business/Start";
import { KycPersonalInstantId } from "./personal/InstantId";
import { KYCPersonalStart } from "./personal/Start";
import { KYCPersonalUpload } from "./personal/Upload";

export const KycRouter: React.SFC = () => (
  <Switch>
    <Route path={kycRoutes.start} component={KYCStart} exact />

    {/* Personal */}
    <Route path={kycRoutes.individualStart} component={KYCPersonalStart} />
    <Route path={kycRoutes.individualInstantId} component={KycPersonalInstantId} />
    <Route path={kycRoutes.individualUpload} component={KYCPersonalUpload} />

    {/* Business */}
    <Route path={kycRoutes.businessStart} component={KycBusinessStart} />
    <Route path={kycRoutes.legalRepresentative} component={KycLegalRepresentative} />
    <Route path={kycRoutes.businessData} component={KycBusinessData} />
    <Route path={kycRoutes.beneficialOwners} component={KYCBeneficialOwners} />

    <Redirect to={kycRoutes.start} />
  </Switch>
);
