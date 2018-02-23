import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { CreateWallet } from "./CreateWallet";
import { walletLightRoutes } from "./walletLightRoutes";

export const WalletLightRouter: React.SFC = () => {
  return (
    <Switch>
      <Route path={walletLightRoutes.create} component={CreateWallet} />
      <Redirect to={walletLightRoutes.create} />
    </Switch>
  );
};
