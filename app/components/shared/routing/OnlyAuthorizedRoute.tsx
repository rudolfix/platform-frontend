import { LocationDescriptor } from "history";
import * as queryString from "query-string";
import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { RouterState } from "react-router-redux";
import { selectIsAuthorized } from "../../../modules/auth/reducer";
import { appConnect } from "../../../store";
import { loginWalletRoutes } from "../../walletSelector/walletRoutes";

interface IStateProps {
  isAuthorized: boolean;
  redirectionUrl: LocationDescriptor;
}

type TProps = RouteProps & IStateProps;

export const OnlyAuthorizedRouteComponent: React.SFC<TProps> = ({
  isAuthorized,
  redirectionUrl,
  component: Component,
  ...rest
}) => {
  const ComponentAsAny = Component as any;
  return (
    <Route
      {...rest}
      render={() => (isAuthorized ? <ComponentAsAny /> : <Redirect to={redirectionUrl} />)}
    />
  );
};

export const OnlyAuthorizedRoute = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    isAuthorized: selectIsAuthorized(s.auth),
    redirectionUrl: generateRedirectionUrl(s.router),
  }),
})(OnlyAuthorizedRouteComponent);

export function generateRedirectionUrl(state: RouterState): LocationDescriptor {
  return {
    pathname: loginWalletRoutes.light,
    search: queryString.stringify({
      redirect: state.location!.pathname + state.location!.search,
    }),
  };
}
