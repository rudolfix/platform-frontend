import * as queryString from "query-string";
import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { OnlyAuthorizedRoute } from "./shared/routing/OnlyAuthorizedRoute";
import { OnlyPublicRoute } from "./shared/routing/OnlyPublicRoute";

import { Dashboard } from "./dashboard/Dashboard";
import { Demo } from "./Demo";
import { Documents } from "./Documents";
import { EtoDashboard } from "./eto/EtoDashboard";
import { Kyc } from "./kyc/Kyc";
import { Portfolio } from "./Portfolio";

import { appRoutes } from "./appRoutes";
import { EmailVerify } from "./emailVerify";
import { EtoPreview } from "./eto/EtoPreview";
import { EtoPublicView } from "./eto/EtoPublicView";
import { EtoRegister } from "./eto/registration/Start";
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

    {process.env.NF_ISSUERS_ENABLED === "1" && [
      <OnlyPublicRoute
        key={appRoutes.etoLanding}
        path={appRoutes.etoLanding}
        component={LandingEto}
      />,
      <OnlyPublicRoute
        key={appRoutes.registerEto}
        path={appRoutes.registerEto}
        component={EtoSecretProtectedWalletSelector}
      />,
      <OnlyPublicRoute
        key={appRoutes.loginEto}
        path={appRoutes.loginEto}
        component={EtoSecretProtectedWalletSelector}
      />,
      <OnlyPublicRoute
        key={appRoutes.recoverEto}
        path={appRoutes.recoverEto}
        component={WalletRecoverMain}
      />,
    ]}

    {/* only investors routes */}
    <OnlyAuthorizedRoute path={appRoutes.portfolio} investorComponent={Portfolio} />
    <OnlyAuthorizedRoute path={appRoutes.wallet} investorComponent={Wallet} />
    <OnlyAuthorizedRoute path={appRoutes.documents} issuerComponent={Documents} />
    <OnlyAuthorizedRoute path={appRoutes.etoRegister} issuerComponent={EtoRegister} />
    <OnlyAuthorizedRoute path={appRoutes.etoPublicView} issuerComponent={EtoPublicView} exact />

    {/* common routes for both investors and issuers */}
    <OnlyAuthorizedRoute
      path={appRoutes.dashboard}
      investorComponent={Dashboard}
      issuerComponent={EtoDashboard}
      exact
    />
    <OnlyAuthorizedRoute
      path={appRoutes.verify}
      investorComponent={EmailVerify}
      issuerComponent={EmailVerify}
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
    <OnlyAuthorizedRoute
      path={appRoutes.etoPreview}
      investorComponent={EtoPreview}
      issuerComponent={EtoPreview}
    />

    <Route path={appRoutes.demo} component={Demo} />

    <Redirect to={appRoutes.root} />
  </SwitchConnected>
);

const SecretProtected = (Component: any) =>
  class extends React.Component<any> {
    shouldComponentUpdate(): boolean {
      return false;
    }

    render(): React.ReactNode {
      const props = this.props;
      const params = queryString.parse(window.location.search);

      if (!process.env.NF_ISSUERS_SECRET || params.etoSecret === process.env.NF_ISSUERS_SECRET) {
        return <Component {...props} />;
      }

      return <Redirect to="/" />;
    }
  };
const EtoSecretProtectedWalletSelector = SecretProtected(WalletSelector);
