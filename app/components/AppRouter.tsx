import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { OnlyAuthorizedRoute } from "./shared/routing/OnlyAuthorizedRoute";
import { OnlyPublicRoute } from "./shared/routing/OnlyPublicRoute";

import { Dashboard } from "./dashboard/Dashboard";
import { Demo } from "./Demo";
import { Eto } from "./eto/Eto";
import { EtoDashboard } from "./eto/EtoDashboard";
import { Kyc } from "./kyc/Kyc";

import { appRoutes } from "./appRoutes";
import { emailVerify } from "./emailVerify";
import { EtoOverview } from "./eto/EtoOverview";
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
    <OnlyPublicRoute path={appRoutes.register} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.login} component={WalletSelector} />
    <OnlyPublicRoute path={appRoutes.recover} component={WalletRecoverMain} />

    {process.env.NF_ISSUERS_ENABLED === "1" && (
      <>
        <OnlyPublicRoute path={appRoutes.etoLanding} component={LandingEto} />
        <OnlyPublicRoute path={appRoutes.registerEto} component={WalletSelector} />
        <OnlyPublicRoute path={appRoutes.loginEto} component={WalletSelector} />
        <OnlyPublicRoute path={appRoutes.recoverEto} component={WalletRecoverMain} />
      </>
    )}

    {/* only investors routes */}
    <OnlyAuthorizedRoute path={appRoutes.wallet} investorComponent={Wallet} />

    {/* only issuers routes */}
    <OnlyAuthorizedRoute path={appRoutes.eto} issuerComponent={Eto} />

    {/* common routes for both investors and issuers */}
    <OnlyAuthorizedRoute
      path={appRoutes.dashboard}
      investorComponent={Dashboard}
      issuerComponent={EtoDashboard}
      exact
    />
    <OnlyAuthorizedRoute
      path={appRoutes.etoOverview}
      issuerComponent={EtoOverview}
      investorComponent={EtoOverview}
    />
    <OnlyAuthorizedRoute
      path={appRoutes.verify}
      investorComponent={emailVerify}
      issuerComponent={emailVerify}
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
    <OnlyAuthorizedRoute path={appRoutes.kyc} investorComponent={Kyc} issuerComponent={Kyc} />

    <Route path={appRoutes.demo} component={Demo} />

    <Redirect to={appRoutes.root} />
  </SwitchConnected>
);
