import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { RegisterWallet } from "./RegisterWallet";
import { walletLightRoutes } from "./walletLightRoutes";

export const WalletLightRouter: React.SFC = () => {
  return (
    <Switch>
      <Route path={walletLightRoutes.register} component={RegisterWallet} />
      <Redirect to={walletLightRoutes.register} />
    </Switch>
  );
};
