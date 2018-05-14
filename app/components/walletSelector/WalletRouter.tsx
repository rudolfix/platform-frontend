import * as React from "react";
import { Redirect, Route } from "react-router-dom";

import { appRoutes } from "../appRoutes";

import { SwitchConnected } from "../shared/connectedRouting";
import { WalletBrowser } from "./browser/WalletBrowser";
import { WalletLedger } from "./ledger/WalletLedger";
import { WalletLight } from "./light/WalletLight";

interface IProps {
  rootPath: string;
}

export const WalletRouter: React.SFC<IProps> = ({ rootPath }) => (
  <SwitchConnected>
    <Route path={`${rootPath}/light`} component={WalletLight} />
    <Route path={`${rootPath}/browser`} component={WalletBrowser} exact />
    <Route path={`${rootPath}/ledger`} component={WalletLedger} exact />
    <Route
      path={`${appRoutes.loginEto}`}
      render={() => <Redirect to={`${rootPath}/ledger`} />}
      exact
    />
    <Redirect to={`${rootPath}/light`} />
  </SwitchConnected>
);
