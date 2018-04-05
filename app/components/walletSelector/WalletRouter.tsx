import * as React from "react";
import { Redirect, Route, Switch } from "react-router-dom";

import { selectActivationCodeFromQueryString } from "../../modules/web3/reducer";
import { appConnect } from "../../store";
import { WalletLight } from "./light/WalletLight";
import { WalletBrowser } from "./WalletBrowser";
import { WalletLedger } from "./WalletLedger";

interface IProps {
  rootPath: string;
}

interface IStateProps {
  routerState: any;
}

export const WalletRouterComponent: React.SFC<IStateProps & IProps> = ({ rootPath }) => (
  <Switch>
    <Route path={`${rootPath}/light`} component={WalletLight} />
    <Route path={`${rootPath}/browser`} component={WalletBrowser} exact />
    <Route path={`${rootPath}/ledger`} component={WalletLedger} exact />
    <Redirect
      to={{
        pathname: `${rootPath}/light`,
        search: window.location.href,
      }}
    />
  </Switch>
);

export const WalletRouter = appConnect<IStateProps, {}, IProps>({
  stateToProps: s => ({
    routerState: selectActivationCodeFromQueryString(s.router),
  }),
})(WalletRouterComponent);
