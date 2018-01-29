import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { WalletBrowser } from "./WalletBrowser";
import { WalletLedger } from "./WalletLedger";
import { WalletLight } from "./walletLight/WalletLight";
import { walletRoutes } from "./walletRoutes";

export const WalletRouter: React.SFC = () => (
  <Switch>
    <Route path={walletRoutes.light} component={WalletLight} />
    <Route path={walletRoutes.browser} component={WalletBrowser} exact />
    <Route path={walletRoutes.ledger} component={WalletLedger} exact />
    <Redirect to={walletRoutes.light} />
  </Switch>
);
