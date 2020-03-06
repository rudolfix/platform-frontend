import { Location } from "history";
import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { EWalletType } from "../../modules/web3/types";
import { SwitchConnected } from "../../utils/react-connected-components/connectedRouting";
import { WalletBrowser } from "./browser/Login/WalletBrowser";
import { WalletLedger } from "./ledger/WalletLedger";
import { LoginLightWallet } from "./light/login/LoginLightWallet";
import { WalletChooser } from "./WalletChooser";

type TWalletRouterProps = {
  rootPath: string;
  showWalletSelector: boolean;
  // we don't care here about exact type
  redirectLocation: Location;
};

type TWalletComponentProps = {
  rootPath: string;
  showWalletSelector: boolean;
};

export const LightWalletComponent: React.FunctionComponent<TWalletComponentProps> = ({
  rootPath,
  showWalletSelector,
}) => (
  <>
    <LoginLightWallet />
    {showWalletSelector && <WalletChooser rootPath={rootPath} activeWallet={EWalletType.LIGHT} />}
  </>
);

export const BrowserWalletComponent: React.FunctionComponent<TWalletComponentProps> = ({
  rootPath,
  showWalletSelector,
}) => (
  <>
    <WalletBrowser />
    {showWalletSelector && <WalletChooser rootPath={rootPath} activeWallet={EWalletType.BROWSER} />}
  </>
);

export const LedgerWalletComponent: React.FunctionComponent<TWalletComponentProps> = ({
  rootPath,
  showWalletSelector,
}) => (
  <>
    <WalletLedger />
    {showWalletSelector && <WalletChooser rootPath={rootPath} activeWallet={EWalletType.LEDGER} />}
  </>
);

export const WalletRouter: React.FunctionComponent<TWalletRouterProps> = ({
  rootPath,
  redirectLocation,
  showWalletSelector,
}) => (
  <SwitchConnected>
    <Route
      path={`${rootPath}/light`}
      component={() => (
        <LightWalletComponent showWalletSelector={showWalletSelector} rootPath={rootPath} />
      )}
      exact
    />
    <Route
      path={`${rootPath}/browser`}
      component={() => (
        <BrowserWalletComponent showWalletSelector={showWalletSelector} rootPath={rootPath} />
      )}
      exact
    />
    <Route
      path={`${rootPath}/ledger`}
      component={() => (
        <LedgerWalletComponent showWalletSelector={showWalletSelector} rootPath={rootPath} />
      )}
      exact
    />
    {/* Preserve location state after redirect, otherwise session timeout message won't work */}
    <Redirect to={redirectLocation} />
  </SwitchConnected>
);
