import * as React from "react";
import { Redirect, Route, RouteProps } from "react-router-dom";

import { selectIsAuthorized } from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { appRoutes } from "../../appRoutes";

interface IStateProps {
  isAuthorized: boolean;
}

interface IState {
  redirect: boolean;
}

type TProps = RouteProps & IStateProps;

/**
 * This component will only attempt to redirect on entering the route. So when user gets logged in you need to trigger redirection on your own.
 */
class OnlyPublicRouteComponent extends React.Component<TProps, IState> {
  state = {
    redirect: false,
  };

  componentWillMount(): void {
    this.setState({
      redirect: this.props.isAuthorized,
    });
  }

  render(): React.ReactNode {
    const { component: Component, ...rest } = this.props;
    const { redirect } = this.state;
    const ComponentAsAny = Component as any;

    return (
      <Route
        {...rest}
        render={() => (!redirect ? <ComponentAsAny /> : <Redirect to={appRoutes.dashboard} />)}
      />
    );
  }
}

export const OnlyPublicRoute = appConnect<IStateProps, {}, RouteProps>({
  stateToProps: s => ({
    isAuthorized: selectIsAuthorized(s.auth),
  }),
})(OnlyPublicRouteComponent);
