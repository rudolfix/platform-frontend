import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { SwitchConnected } from "../utils/react-connected-components/connectedRouting";
import { appRoutes } from "./appRoutes";
import { Dashboard } from "./dashboard/Dashboard";
import { Documents } from "./documents/issuerDocuments/Documents";
import { NomineeDocuments } from "./documents/nomineeDocuments/NomineeDocuments";
import { MigrationFromLink } from "./edge-cases/MigrationFromLink";
import { UnlockWalletFundsFromLink } from "./edge-cases/UnlockWalletFundsFromLink";
import { EtoViewMain } from "./eto/eto-full-view/EtoViewMain";
import { EtoWidgetView } from "./eto/EtoWidgetView";
import { EtoRegister } from "./eto/registration/Start";
import { EtoDashboard } from "./issuer-dashboard/EtoDashboard";
import { Kyc } from "./kyc/Kyc";
import { Landing } from "./landing/Landing";
import { NomineeDashboard } from "./nominee-dashboard/NomineeDashboard";
import { Portfolio } from "./portfolio/Portfolio";
import { BackupSeed } from "./settings/backup-seed/BackupSeed";
import { EmailVerify } from "./settings/EmailVerify";
import { profileRoutes } from "./settings/routes";
import { Settings } from "./settings/Settings";
import { Unsubscription } from "./settings/unsubscription/Unsubscription";
import { UnsubscriptionSuccess } from "./settings/unsubscription/UnsubscriptionSuccess";
import { OnlyAuthorizedRoute } from "./shared/routing/OnlyAuthorizedRoute";
import { OnlyPublicRoute } from "./shared/routing/OnlyPublicRoute";
import { TestCriticalError } from "./testing/critical-error/TestCriticalError";
import { e2eRoutes } from "./testing/e2eRoutes";
import { EmbeddedWidget } from "./testing/embeded-widget/TestEmbededWidget";
import { WalletConnect } from "./wallet-selector/wallet-connect/WalletConnect";
import { WalletRecovery } from "./wallet-selector/WalletRecovery/WalletRecovery";
import { WalletSelectorLogin } from "./wallet-selector/WalletSelectorLogin/WalletSelectorLogin";
import { WalletSelectorRegister } from "./wallet-selector/WalletSelectorRegister/WalletSelectorRegister";
import { Wallet } from "./wallet/Wallet";

export const AppRouter: React.FunctionComponent = () => (
  <SwitchConnected>
    {/* HARDCODED TEMP ROUTES! ------> */}
    <Route path={appRoutes.greyp} component={EtoViewMain} />
    <Route path={appRoutes.greypWithJurisdiction} component={EtoViewMain} />
    {/*<------------------------------- */}
    <Route path={appRoutes.etoPublicViewLegacyRoute} component={EtoViewMain} />
    <Route path={appRoutes.etoPublicViewByIdLegacyRoute} component={EtoViewMain} />
    <Route path={appRoutes.etoPublicView} component={EtoViewMain} />
    <Route path={appRoutes.etoPublicViewById} component={EtoViewMain} />
    <Route path={appRoutes.etoIssuerView} component={EtoViewMain} />
    <Route path={appRoutes.etoIssuerViewStats} component={EtoViewMain} />
    <Route
      path={appRoutes.etoWidgetView}
      render={({ match }) => <EtoWidgetView previewCode={match.params.previewCode} />}
      exact
    />
    <Route path={appRoutes.unsubscriptionSuccess} render={() => <UnsubscriptionSuccess />} exact />
    <Route
      path={appRoutes.unsubscription}
      render={({ match }) => <Unsubscription email={match.params.email} />}
      exact
    />
    {/* routes that are available for not logged in users */}
    <OnlyPublicRoute path={appRoutes.root} component={Landing} exact />
    <OnlyPublicRoute path={appRoutes.login} component={WalletSelectorLogin} />
    <OnlyPublicRoute path={appRoutes.restore} component={WalletRecovery} />,
    {process.env.NF_WALLET_CONNECT_ENABLED === "1" && (
      <OnlyPublicRoute
        path={`${appRoutes.walletconnect}${process.env.NF_WALLET_CONNECT_LINK}`}
        component={WalletConnect}
        exact
      />
    )}
    ,{/* only investors routes */}
    {process.env.NF_PORTFOLIO_PAGE_VISIBLE === "1" && (
      <OnlyAuthorizedRoute path={appRoutes.portfolio} investorComponent={Portfolio} />
    )}
    <OnlyAuthorizedRoute path={appRoutes.icbmMigration} investorComponent={MigrationFromLink} />
    <OnlyAuthorizedRoute
      path={appRoutes.walletUnlock}
      investorComponent={UnlockWalletFundsFromLink}
    />
    {/* only issuer routes */}
    <OnlyAuthorizedRoute path={appRoutes.etoRegister} issuerComponent={EtoRegister} />
    {/* issuer AND nominee routes */}
    <OnlyAuthorizedRoute
      path={appRoutes.documents}
      issuerComponent={Documents}
      nomineeComponent={NomineeDocuments}
      exact
    />
    {/* common routes for both investors and issuers and nominees */}
    <OnlyAuthorizedRoute
      path={appRoutes.wallet}
      investorComponent={Wallet}
      issuerComponent={Wallet}
      nomineeComponent={Wallet}
    />
    <OnlyAuthorizedRoute
      path={appRoutes.dashboard}
      investorComponent={Dashboard}
      issuerComponent={EtoDashboard}
      nomineeComponent={NomineeDashboard}
      exact
    />
    <OnlyAuthorizedRoute
      path={appRoutes.verify}
      investorComponent={EmailVerify}
      issuerComponent={EmailVerify}
      nomineeComponent={EmailVerify}
    />
    <OnlyAuthorizedRoute
      path={appRoutes.profile}
      investorComponent={Settings}
      issuerComponent={Settings}
      nomineeComponent={Settings}
      exact
    />
    <OnlyAuthorizedRoute
      path={profileRoutes.seedBackup}
      investorComponent={BackupSeed}
      issuerComponent={BackupSeed}
      nomineeComponent={BackupSeed}
      exact
    />
    <OnlyAuthorizedRoute
      path={appRoutes.kyc}
      investorComponent={Kyc}
      issuerComponent={Kyc}
      nomineeComponent={Kyc}
    />
    {/*Routes used only in E2E tests*/}
    {process.env.NF_CYPRESS_RUN === "1" && [
      <Route
        key={1}
        path={e2eRoutes.embeddedWidget}
        render={({ match }) => <EmbeddedWidget previewCode={match.params.previewCode} />}
        exact
      />,
      <Route key={2} path={e2eRoutes.criticalError} render={() => <TestCriticalError />} exact />,
    ]}
    {/*Components that render WalletSelectorRegister*/}
    <OnlyPublicRoute path={appRoutes.register} component={WalletSelectorRegister} exact />
    <OnlyPublicRoute path={appRoutes.registerWithLedger} component={WalletSelectorRegister} exact />
    <OnlyPublicRoute
      path={appRoutes.registerWithLightWallet}
      component={WalletSelectorRegister}
      exact
    />
    <OnlyPublicRoute
      path={appRoutes.registerWithBrowserWallet}
      component={WalletSelectorRegister}
      exact
    />
    <OnlyPublicRoute
      key={appRoutes.registerIssuer}
      path={appRoutes.registerIssuer}
      component={WalletSelectorRegister}
    />
    <OnlyPublicRoute
      key={appRoutes.registerNominee}
      path={appRoutes.registerNominee}
      component={WalletSelectorRegister}
    />
    <Redirect to={appRoutes.root} />
  </SwitchConnected>
);
