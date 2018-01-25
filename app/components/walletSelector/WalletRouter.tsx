import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { appRoutes } from "../AppRouter";
import { WalletBrowser } from "./WalletBrowser";
import { WalletLedger } from "./WalletLedger";
import { WalletLight } from "./WalletLight";

const parentRoutePath = appRoutes.login;
export const walletRoutes = {
  light: parentRoutePath + "/light",
  browser: parentRoutePath + "/browser",
  ledger: parentRoutePath + "/ledger",
};

export const WalletRouter: React.SFC = () => (
  <Switch>
    <Route path={walletRoutes.light} component={WalletLight} exact />
    <Route path={walletRoutes.browser} component={WalletBrowser} exact />
    <Route path={walletRoutes.ledger} component={WalletLedger} exact />
    <Redirect to={walletRoutes.light} />
  </Switch>
);
