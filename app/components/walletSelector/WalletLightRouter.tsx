import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { CreateWallet, SavePassPhrase } from "./WalletLight";
import { walletLightRoutes } from "./walletLightRoutes";

export const WalletLightRouter: React.SFC = () => {
  return (
    <Switch>
      <Route path={walletLightRoutes.create} component={CreateWallet} />
      <Route path={walletLightRoutes.recover} component={SavePassPhrase} />
      <Route path={walletLightRoutes.save} component={SavePassPhrase} />
      <Redirect to={walletLightRoutes.create} />
    </Switch>
  );
};
