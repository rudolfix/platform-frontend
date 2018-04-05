export const appRoutes = {
  wallet: "/wallet",
  verify: "/email-verify",
  root: "/",
  register: "/register",
  login: "/login",
  kyc: "/kyc",
  recover: "/recover",
  dashboard: "/dashboard",
  settings: "/settings",
  demo: "/demo",
  eto: "/eto",
};

import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { Dashboard } from "./dashboard/Dashboard";
import { Demo } from "./Demo";
import { Eto } from "./eto/Eto";
import { Home } from "./Home";
import { Kyc } from "./kyc/Kyc";

import { BackupSeed } from "./settings/backupSeed/BackupSeed";
import { settingsRoutes } from "./settings/routes";
import { Settings } from "./settings/Settings";
import { OnlyAuthorizedRoute } from "./shared/routing/OnlyAuthorizedRoute";
import { OnlyPublicRoute } from "./shared/routing/OnlyPublicRoute";
import { Wallet } from "./wallet/Wallet";
import { WalletRecoverMain } from "./walletSelector/walletRecover/WalletRecoverMain";
import { WalletSelector } from "./walletSelector/WalletSelector";
import { WalletVerify } from "./walletVerify";

export const AppRouter: React.SFC = () => (
  <Switch>
    <OnlyPublicRoute path={appRoutes.root} component={Home} exact />
    <OnlyPublicRoute path={appRoutes.register} component={WalletSelector} />
    <Route path={appRoutes.login} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.recover} component={WalletRecoverMain} />
   
    <OnlyAuthorizedRoute path={appRoutes.verify} component={WalletVerify} />
    <OnlyAuthorizedRoute path={appRoutes.wallet} component={Wallet} />
    <OnlyAuthorizedRoute path={appRoutes.kyc} component={Kyc} />
    <OnlyAuthorizedRoute path={appRoutes.dashboard} component={Dashboard} exact />
    <OnlyAuthorizedRoute path={appRoutes.settings} component={Settings} exact />
    <OnlyAuthorizedRoute path={settingsRoutes.seedBackup} component={BackupSeed} exact />
    <OnlyAuthorizedRoute path={appRoutes.eto} component={Eto} />

    <Route path={appRoutes.demo} component={Demo} />

    <Redirect to={appRoutes.root} />
  </Switch>
);

//TODO: move help into wallet selector
