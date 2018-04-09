import * as queryString from "query-string";
import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { LocationDescriptor } from "history";
import { isFunction } from "lodash";
import { RouterState } from "react-router-redux";
import { selectIsAuthorized } from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { appRoutes } from "../../AppRouter";
import { loginWalletRoutes } from "../../walletSelector/walletRoutes";

interface IStateProps {
  isAuthorized: boolean;
  routerState: RouterState;
}

interface IOwnProps {
  shouldRedirect: (isAuthorized: boolean) => boolean;
  redirectTo: string | ((routerState: RouterState) => LocationDescriptor);
}

interface IState {
  redirect: boolean;
}

type TProps = RouteProps & IStateProps & IOwnProps;

/**
 * This component will only attempt to redirect on entering the route. So when user gets logged in you need to trigger redirection on your own.
 */
export class RedirectBasedOnAuthRouteComponent extends React.Component<TProps, IState> {
  state = {
    redirect: false,
  };

  componentWillMount(): void {
    this.setState({
      redirect: this.props.shouldRedirect(this.props.isAuthorized),
    });
  }

  render(): React.ReactNode {
    const { component: Component, ...rest } = this.props;
    const { redirect } = this.state;
    const ComponentAsAny = Component as any;

    return (
      <Route
        {...rest}
        render={() =>
          !redirect ? (
            <ComponentAsAny />
          ) : (
            <Redirect
              to={
                isFunction(this.props.redirectTo)
                  ? this.props.redirectTo(this.props.routerState)
                  : this.props.redirectTo
              }
            />
          )
        }
      />
    );
  }
}

export const RedirectBasedOnAuthRoute = appConnect<IStateProps, {}, IOwnProps>({
  stateToProps: s => ({
    isAuthorized: selectIsAuthorized(s.auth),
    routerState: s.router,
  }),
})(RedirectBasedOnAuthRouteComponent);

export const OnlyPublicRoute: React.SFC<RouteProps> = ({ ...props }) => (
  <RedirectBasedOnAuthRoute
    shouldRedirect={(isAuth: boolean) => isAuth}
    redirectTo={appRoutes.dashboard}
    {...props}
  />
);

export const OnlyAuthorizedRoute: React.SFC<RouteProps> = ({ ...props }) => (
  <RedirectBasedOnAuthRoute
    shouldRedirect={(isAuth: boolean) => !isAuth}
    redirectTo={(state: RouterState) => {
      return {
        pathname: loginWalletRoutes.light,
        search: queryString.stringify({
          redirect: state.location!.pathname + state.location!.search,
        }),
      };
    }}
    {...props}
  />
);
