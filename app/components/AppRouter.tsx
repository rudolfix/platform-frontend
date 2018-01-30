export const appRoutes = {
  root: "/",
  login: "/login",
  kyc: "/kyc",
  dashboard: "/dashboard",
};

import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { Dashboard } from "./Dashboard";
import { Home } from "./Home";
import { Kyc } from "./Kyc";
import { WalletSelector } from "./walletSelector/WalletSelector";

export const AppRouter: React.SFC = () => (
  <Switch>
    <Route path={appRoutes.root} component={Home} exact />
    <Route path={appRoutes.login} component={WalletSelector} />
    <Route path={appRoutes.kyc} component={Kyc} exact />
    <Route path={appRoutes.dashboard} component={Dashboard} exact />
    <Redirect to={appRoutes.root} />
  </Switch>
);
