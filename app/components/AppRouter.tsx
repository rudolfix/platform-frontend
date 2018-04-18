export const appRoutes = {
  verify: "/email-verify",

  root: "/",

  register: "/register",
  registerEto: "/eto/register",
  login: "/login",
  loginEto: "/eto/login",
  recover: "/recover",
  recoverEto: "/eto/recover",

  kyc: "/kyc",
  wallet: "/wallet",
  dashboard: "/dashboard",
  settings: "/settings",
  demo: "/demo",
  eto: "/eto",
};

import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { OnlyAuthorizedRoute } from "./shared/routing/OnlyAuthorizedRoute";
import { OnlyPublicRoute } from "./shared/routing/OnlyPublicRoute";

import { Dashboard } from "./dashboard/Dashboard";
import { Demo } from "./Demo";
import { Eto } from "./eto/Eto";
import { EtoDashboard } from "./eto/EtoDashboard";
import { Home } from "./Home";
import { Kyc } from "./kyc/Kyc";

import { emailVerify } from "./emailVerify";
import { Landing } from "./landing/Landing";
import { LandingEto } from "./landing/LandingEto";
import { BackupSeed } from "./settings/backupSeed/BackupSeed";
import { settingsRoutes } from "./settings/routes";
import { Settings } from "./settings/Settings";
import { SwitchConnected } from "./shared/connectedRouting";
import { Wallet } from "./wallet/Wallet";
import { WalletRecoverMain } from "./walletSelector/walletRecover/WalletRecoverMain";
import { WalletSelector } from "./walletSelector/WalletSelector";

export const AppRouter: React.SFC = () => (
  <SwitchConnected>
    <OnlyPublicRoute path={appRoutes.root} component={Landing} exact />
    <OnlyPublicRoute path={appRoutes.eto} component={LandingEto} />
    <OnlyPublicRoute path={appRoutes.register} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.login} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.recover} component={WalletRecoverMain} />

    <OnlyPublicRoute path={appRoutes.registerEto} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.loginEto} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.recoverEto} component={WalletRecoverMain} />

    {/* only investors routes */}
    <OnlyAuthorizedRoute path={appRoutes.wallet} investorComponent={Wallet} />
    <OnlyAuthorizedRoute path={appRoutes.kyc} investorComponent={Kyc} />
    <OnlyAuthorizedRoute path={appRoutes.eto} investorComponent={Eto} />

    {/* common routes for both investors and issuers */}
    <OnlyAuthorizedRoute
      path={appRoutes.verify}
      investorComponent={emailVerify}
      issuerComponent={emailVerify}
    />
    <OnlyAuthorizedRoute
      path={appRoutes.dashboard}
      investorComponent={Dashboard}
      issuerComponent={EtoDashboard}
      exact
    />
    <OnlyAuthorizedRoute
      path={appRoutes.settings}
      investorComponent={Settings}
      issuerComponent={Settings}
      exact
    />
    <OnlyAuthorizedRoute
      path={settingsRoutes.seedBackup}
      investorComponent={BackupSeed}
      issuerComponent={BackupSeed}
      exact
    />

    <Route path={appRoutes.demo} component={Demo} />

    <Redirect to={appRoutes.root} />
  </SwitchConnected>
);
