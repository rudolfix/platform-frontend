import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { CreateWallet } from "./CreateWallet";
import { RecoverWallet } from "./RecoverWallet";
import { walletLightRoutes } from "./walletLightRoutes";
import { WalletLightSeedRecovery } from "./WalletLightSeedRecovery";

export const WalletLightRouter: React.SFC = () => {
  return (
    <Switch>
      <Route path={walletLightRoutes.create} component={CreateWallet} />
      <Route path={walletLightRoutes.recover} component={RecoverWallet} />
      <Route path={walletLightRoutes.seed} component={WalletLightSeedRecovery} />
      <Redirect to={walletLightRoutes.create} />
    </Switch>
  );
};
