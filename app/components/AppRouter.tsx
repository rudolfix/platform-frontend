export const appRoutes = {
  root: "/",
  register: "/register",
  kyc: "/kyc",
  recover: "/recover",
  dashboard: "/dashboard",
  help: "/help",
};

import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { Dashboard } from "./dashboard/Dashboard";
import { Home } from "./Home";
import { Kyc } from "./kyc/Kyc";
import { WalletRecoverMain } from "./walletSelector/walletRecover/WalletRecoverMain";
import { WalletSelector } from "./walletSelector/WalletSelector";

export const AppRouter: React.SFC = () => (
  <Switch>
    <Route path={appRoutes.root} component={Home} exact />
    <Route path={appRoutes.register} component={WalletSelector} />
    <Route path={appRoutes.kyc} component={Kyc} />
    <Route path={appRoutes.dashboard} component={Dashboard} exact />
    <Route path={appRoutes.recover} component={WalletRecoverMain} />

    <Redirect to={appRoutes.root} />
  </Switch>
);

//TODO: move help into wallet selector
