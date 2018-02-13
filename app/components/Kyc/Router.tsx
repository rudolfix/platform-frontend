import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";
import { kycRoutes } from "./routes";

import { Start } from "./Start";

export const KycRouter: React.SFC = () => (
  <Switch>
    <Route path={kycRoutes.start} component={Start} />
    <Redirect to={kycRoutes.start} />
  </Switch>
);
