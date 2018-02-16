import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { kycRoutes } from "./routes";

import { KYCStart } from "./Start";

// private
import { KYCPersonalDone } from "./Personal/Done";
import { KYCPersonalIDUpload } from "./Personal/IDUpload";
import { KYCPersonalInstantID } from "./Personal/InstantID";
import { KYCPersonalManualVerification } from "./Personal/ManualVerification";
import { KYCPersonalStart } from "./Personal/Start";

// company
import { KYCCompanyDone } from "./Company/Done";
import { KYCCompanyStart } from "./Company/Start";

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
