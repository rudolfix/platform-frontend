import * as React from "react";
import { Route, RouteProps, Redirect } from "react-router-dom";
import { appConnect } from "../../../store";
import { selectIsAuthorized } from "../../../modules/auth/reducer";
import { appRoutes } from "../../AppRouter";

interface IStateProps {
  isAuthorized: boolean;
}

type TProps = RouteProps & IStateProps;

export const OnlyPublicRouteComponent: React.SFC<TProps> = ({
  isAuthorized,
  component: Component,
  ...rest
}) => {
  const ComponentAsAny = Component as any;
  return (
    <Route {...rest} render={() => (!isAuthorized ? <ComponentAsAny /> : <Redirect to={appRoutes.dashboard} />)} />
  );
};

export const OnlyPublicRoute = appConnect<IStateProps, {}>({
  stateToProps: s => ({
    isAuthorized: selectIsAuthorized(s.auth),
  }),
})(OnlyPublicRouteComponent);
