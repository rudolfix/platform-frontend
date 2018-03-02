import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { WalletBrowser } from "./WalletBrowser";
import { WalletLedger } from "./WalletLedger";
import { WalletLight } from "./walletRegister/WalletLight";

interface IProps {
  rootPath: string;
}

export const WalletRouter: React.SFC<IProps> = ({ rootPath }) => (
  <Switch>
    <Route path={`${rootPath}/light`} component={WalletLight} />
    <Route path={`${rootPath}/browser`} component={WalletBrowser} exact />
    <Route path={`${rootPath}/ledger`} component={WalletLedger} exact />
    <Redirect to={`${rootPath}/light`} />
  </Switch>
);
