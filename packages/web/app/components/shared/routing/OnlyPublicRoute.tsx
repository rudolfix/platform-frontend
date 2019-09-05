import * as React from "react";
import { RouteProps } from "react-router-dom";
import { branch, compose, renderComponent, renderNothing } from "recompose";

import { actions } from "../../../modules/actions";
import { selectIsAuthorized } from "../../../modules/auth/selectors";
import { appConnect, AppDispatch } from "../../../store";
import { onEnterAction } from "../../../utils/OnEnterAction";
import { LoadingComponent } from "../../dashboard/my-portfolio/MyPortfolioWidget";

interface IStateProps {
  isAuthorized: boolean;
}

interface IComponentProps {
  isAuthorized: boolean;
  component: React.ReactType;
}

const OnlyPublicRouteComponent: React.FunctionComponent<IComponentProps> = ({
  component: Component,
  ...rest
}) => <Component {...rest} />;

export const OnlyPublicRoute = compose<IComponentProps, RouteProps>(
  appConnect<IStateProps, {}, RouteProps>({
    stateToProps: s => ({
      isAuthorized: selectIsAuthorized(s.auth),
    }),
  }),
  onEnterAction({
    actionCreator: (dispatch: AppDispatch, props: IStateProps) => {
      if (props.isAuthorized) {
        dispatch(actions.routing.goToDashboard());
      }
    },
  }),
  // We should not show child component if we are invoking redirection to prevent it from running it's enter actions
  branch<IStateProps>(state => state.isAuthorized, renderComponent(LoadingComponent)),
  branch<IStateProps & RouteProps>(state => state.component === undefined, renderNothing),
)(OnlyPublicRouteComponent);
