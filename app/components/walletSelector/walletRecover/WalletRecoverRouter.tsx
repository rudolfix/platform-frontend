import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { RecoverWallet } from "./RecoverWallet";
import { WalletLightSeedRecovery } from "./WalletLightSeedRecovery";
import { WalletLoginHelp } from "./WalletLoginHelp";
import { walletRecoverRoutes } from "./walletRecoverRoutes";

export const WalletRecoverRouter: React.SFC = () => {
  return (
    <Switch>
      <Route path={walletRecoverRoutes.help} component={WalletLoginHelp} />
      <Route path={walletRecoverRoutes.create} component={RecoverWallet} />
      <Route path={walletRecoverRoutes.done} component={RecoverWallet} />
      <Route path={walletRecoverRoutes.seed} component={WalletLightSeedRecovery}  />
      <Redirect to={walletRecoverRoutes.help} />
    </Switch>
  );
};
