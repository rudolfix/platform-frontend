import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { kycRoutes } from "./routes";

import { KYCStart } from "./start/Start";

// private
import { KYCPersonalDone } from "./personal/Done";
import { KYCPersonalIDUpload } from "./personal/IDUpload";
import { KYCPersonalInstantID } from "./personal/InstantID";
import { KYCPersonalManualVerification } from "./personal/ManualVerification";
import { KYCPersonalStart } from "./personal/Start";

// company
import { KYCCompanyDone } from "./company/Done";
import { KYCCompanyStart } from "./company/Start";

export const KycRouter: React.SFC = () => (
  <Switch>
    <Route path={kycRoutes.start} component={KYCStart} exact />

    {/* Personal */}
    <Route path={kycRoutes.personalStart} component={KYCPersonalStart} />
    <Route path={kycRoutes.personalInstantId} component={KYCPersonalInstantID} />
    <Route path={kycRoutes.personalManualVerification} component={KYCPersonalManualVerification} />
    <Route path={kycRoutes.personalIDUpload} component={KYCPersonalIDUpload} />
    <Route path={kycRoutes.personalDone} component={KYCPersonalDone} />

    {/* Company */}
    <Route path={kycRoutes.companyStart} component={KYCCompanyStart} />
    <Route path={kycRoutes.companyDone} component={KYCCompanyDone} />

    <Redirect to={kycRoutes.start} />
  </Switch>
);
