import { createLocation, Location } from "history";
import * as React from "react";
import { Redirect, Route, RouteComponentProps } from "react-router-dom";
import { compose, withProps } from "recompose";

import { TLoginRouterState } from "../../../modules/routing/types";
import { selectRootPath } from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { SwitchConnected } from "../../../utils/react-connected-components/connectedRouting";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { LoginBrowserWallet } from "./LoginBrowserWallet/LoginBrowserWallet";
import { LoginLightWallet } from "./LoginLightWallet/LoginLightWallet";
import { getRedirectionUrl } from "./utils";
import { LoginWalletLedger } from "./WalletLedger/LoginWalletLedger";

type TRouteLoginProps = RouteComponentProps<unknown, never, TLoginRouterState>;

interface IStateProps {
  rootPath: string;
}

type TAdditionalProps = {
  redirectLocation: Location;
};

interface IExternalProps {
  rootPath: string;
  redirectLocation: Location;
}

export const WalletSelectorLoginBase: React.FunctionComponent<IStateProps &
  TAdditionalProps &
  IExternalProps> = ({ rootPath, redirectLocation }) => (
  <SwitchConnected>
    <Route path={`${rootPath}/light`} component={LoginLightWallet} exact />
    <Route path={`${rootPath}/browser`} component={LoginBrowserWallet} exact />
    <Route path={`${rootPath}/ledger`} component={LoginWalletLedger} exact />
    {/* Preserve location state after redirect, otherwise session timeout message won't work */}
    <Redirect to={redirectLocation} />
  </SwitchConnected>
);

export const WalletSelectorLogin = compose<IStateProps & TAdditionalProps, {}>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, {}>({
    stateToProps: s => ({
      rootPath: selectRootPath(s.router),
    }),
  }),
  withProps<TAdditionalProps, IStateProps & TRouteLoginProps>(({ rootPath, location }) => ({
    redirectLocation: createLocation(getRedirectionUrl(rootPath), location.state),
  })),
)(WalletSelectorLoginBase);
