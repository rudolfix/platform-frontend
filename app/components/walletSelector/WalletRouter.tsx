import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { WalletLight } from "./light/WalletLight";
import { WalletBrowser } from "./WalletBrowser";
import { WalletLedger } from "./WalletLedger";

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
