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

const LightWallet: React.FunctionComponent<TWalletComponentProps> = ({
  rootPath,
  showWalletSelector,
}) => (
  <>
    <LoginLightWallet />
    {showWalletSelector && <WalletChooser rootPath={rootPath} activeWallet={EWalletType.LIGHT} />}
  </>
);

const BrowserWallet: React.FunctionComponent<TWalletComponentProps> = ({
  rootPath,
  showWalletSelector,
}) => (
  <>
    <WalletBrowser />
    {showWalletSelector && <WalletChooser rootPath={rootPath} activeWallet={EWalletType.BROWSER} />}
  </>
);

const LedgerWallet: React.FunctionComponent<TWalletComponentProps> = ({
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
        <LightWallet showWalletSelector={showWalletSelector} rootPath={rootPath} />
      )}
      exact
    />
    <Route
      path={`${rootPath}/browser`}
      component={() => (
        <BrowserWallet showWalletSelector={showWalletSelector} rootPath={rootPath} />
      )}
      exact
    />
    <Route
      path={`${rootPath}/ledger`}
      component={() => (
        <LedgerWallet showWalletSelector={showWalletSelector} rootPath={rootPath} />
      )}
      exact
    />
    {/* Preserve location state after redirect, otherwise session timeout message won't work */}
    <Redirect to={redirectLocation} />
  </SwitchConnected>
);
