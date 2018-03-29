import * as React from "react";
import { Route, Switch } from "react-router-dom";
import { parentRoutePath, walletRoutes } from "./routes";

import { DepositEth } from "./views/deposit-funds/DepositEth";
import { DepositEuroToken } from "./views/deposit-funds/DepositEuroToken";
import { ManageWallet } from "./views/manage-wallet/ManageWallet";
import { WalletStart } from "./views/start/Start";

export const WalletRouter: React.SFC = props => (
  <Switch>
    <Route path={ parentRoutePath } component={WalletStart} exact />

    {/* Manage Wallet */}
    <Route path={walletRoutes.manageWallet} component={ManageWallet} exact />

    {/* Deposit Funds */}
    <Route path={walletRoutes.euroToken} render={props => <DepositEuroToken path={walletRoutes.euroToken} />} exact />
    <Route path={walletRoutes.eth} render={props => <DepositEth path={walletRoutes.eth} />} exact />
  </Switch>
);
