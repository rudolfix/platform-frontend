import { Location } from "history";
import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { EWalletType } from "../../../modules/web3/types";
import { SwitchConnected } from "../../../utils/react-connected-components/connectedRouting";
import { WalletChooser } from "../shared/WalletChooser";
import { LoginBrowserWallet } from "./LoginBrowserWallet/LoginBrowserWallet";
import { LoginLightWallet } from "./LoginLightWallet/LoginLightWallet";
import { WalletLedger } from "./WalletLedger/WalletLedger";

type TWalletRouterProps = {
  rootPath: string;
  showWalletSelector: boolean;
  redirectLocation: Location;
};

// This is used internally by `WalletLoginRouter`
const InternalWalletSelector: React.FunctionComponent<Pick<
  TWalletRouterProps,
  "rootPath" | "showWalletSelector"
>> = props => (props.showWalletSelector ? <WalletChooser {...props} /> : null);

export const WalletLoginRouter: React.FunctionComponent<TWalletRouterProps> = ({
  rootPath,
  redirectLocation,
  showWalletSelector,
}) => (
  <SwitchConnected>
    <Route
      path={`${rootPath}/light`}
      component={() => (
        <>
          <LoginLightWallet />
          <InternalWalletSelector
            rootPath={rootPath}
            showWalletSelector={showWalletSelector}
            activeWallet={EWalletType.LIGHT}
          />
        </>
      )}
      exact
    />
    <Route
      path={`${rootPath}/browser`}
      component={() => (
        <>
          <LoginBrowserWallet />
          <InternalWalletSelector
            rootPath={rootPath}
            showWalletSelector={showWalletSelector}
            activeWallet={EWalletType.BROWSER}
          />
        </>
      )}
      exact
    />
    <Route
      path={`${rootPath}/ledger`}
      component={() => (
        <>
          <WalletLedger />
          <InternalWalletSelector
            rootPath={rootPath}
            showWalletSelector={showWalletSelector}
            activeWallet={EWalletType.LEDGER}
          />
        </>
      )}
      exact
    />
    {/* Preserve location state after redirect, otherwise session timeout message won't work */}
    <Redirect to={redirectLocation} />
  </SwitchConnected>
);
