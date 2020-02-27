import { Location } from "history";
import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { EWalletType } from "../../modules/web3/types";
import { SwitchConnected } from "../../utils/react-connected-components/connectedRouting";
import { WalletBrowser } from "./browser/WalletBrowser";
import { WalletLedger } from "./ledger/WalletLedger";
import { WalletLight } from "./light/WalletLight";
import { WalletChooser } from "./WalletChooser";

type TWalletRouterProps = {
  rootPath: string;
  walletSelectionDisabled: boolean;
  // we don't care here about exact type
  redirectLocation: Location;
};

type TWalletComponentProps = {
  rootPath: string;
  walletSelectionDisabled: boolean;
};

export const LightWalletComponent: React.FunctionComponent<TWalletComponentProps> = ({
  rootPath,
  walletSelectionDisabled,
}) => (
  <>
    <WalletLight />
    {!walletSelectionDisabled && (
      <WalletChooser rootPath={rootPath} activeWallet={EWalletType.LIGHT} />
    )}
  </>
);

export const BrowserWalletComponent: React.FunctionComponent<TWalletComponentProps> = ({
  rootPath,
  walletSelectionDisabled,
}) => (
  <>
    <WalletBrowser />
    {!walletSelectionDisabled && (
      <WalletChooser rootPath={rootPath} activeWallet={EWalletType.BROWSER} />
    )}
  </>
);

export const LedgerWalletComponent: React.FunctionComponent<TWalletComponentProps> = ({
  rootPath,
  walletSelectionDisabled,
}) => (
  <>
    <WalletLedger />
    {!walletSelectionDisabled && (
      <WalletChooser rootPath={rootPath} activeWallet={EWalletType.LEDGER} />
    )}
  </>
);

export const WalletRouter: React.FunctionComponent<TWalletRouterProps> = ({
  rootPath,
  redirectLocation,
  walletSelectionDisabled,
}) => (
  <SwitchConnected>
    {console.log("WalletRouter",rootPath)}
    <Route
      path={`${rootPath}/light`}
      component={() => (
        <LightWalletComponent
          walletSelectionDisabled={walletSelectionDisabled}
          rootPath={rootPath}
        />
      )}
      exact
    />
    <Route
      path={`${rootPath}/browser`}
      component={() => (
        <BrowserWalletComponent
          walletSelectionDisabled={walletSelectionDisabled}
          rootPath={rootPath}
        />
      )}
      exact
    />
    <Route
      path={`${rootPath}/ledger`}
      component={() => (
        <LedgerWalletComponent
          walletSelectionDisabled={walletSelectionDisabled}
          rootPath={rootPath}
        />
      )}
      exact
    />
    {/* Preserve location state after redirect, otherwise session timeout message won't work */}
    {/*<Redirect to={redirectLocation} />*/}
  </SwitchConnected>
);
