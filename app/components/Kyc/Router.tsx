import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { kycRoutes } from "./routes";

import { StartKYC } from "./Start";

import { StartCompanyKYC } from "./Company/Start";
import { StartPrivateKYC } from "./Private/Start";

export const KycRouter: React.SFC = () => (
  <Switch>
    <Route path={kycRoutes.start} component={StartKYC} exact />
    <Route path={kycRoutes.privateStart} component={StartPrivateKYC} />
    <Route path={kycRoutes.companyStart} component={StartCompanyKYC} />
    <Redirect to={kycRoutes.start} />
  </Switch>
);
