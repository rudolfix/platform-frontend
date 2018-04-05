import * as queryString from "query-string";
import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";
import { selectIsAuthorized } from "../../../modules/auth/reducer";
import { selectActivationCodeFromQueryString } from '../../../modules/web3/reducer';
import { appConnect } from "../../../store";
import { appRoutes } from "../../AppRouter";

interface IStateProps {
  isAuthorized: boolean;
  routerState: any;
}

type TProps = RouteProps & IStateProps;

export const OnlyAuthorizedRouteComponent: React.SFC<TProps> = ({
  isAuthorized,
  routerState,
  component: Component,
  ...rest
}) => {
  const ComponentAsAny = Component as any;
  return (
    <Route
      {...rest}
      render={() =>
        isAuthorized ? (
          <ComponentAsAny />
        ) : (
          <Redirect
            to={{
              pathname: appRoutes.login,
              search: queryString.stringify(routerState),
            }}
          />
        )
      }
    />
  );
};

export const OnlyAuthorizedRoute = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    isAuthorized: selectIsAuthorized(s.auth),
    routerState: selectActivationCodeFromQueryString(s.router),
  }),
})(OnlyAuthorizedRouteComponent);
