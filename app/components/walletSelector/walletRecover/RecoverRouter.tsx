import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { LoginHelp } from "./LoginHelp";
import { recoverRoutes } from "./recoverRoutes";
import { RecoverWallet } from "./RecoverWallet";
import { RecoverySuccess } from "./RecoverySuccess";

export const RecoverRouter: React.SFC = () => {
  return (
    <Switch>
      <Route path={recoverRoutes.help} component={LoginHelp} />
      <Route path={recoverRoutes.seed} component={RecoverWallet} />
      <Route path={recoverRoutes.success} component={RecoverySuccess} />
      <Redirect to={recoverRoutes.help} />
    </Switch>
  );
};
