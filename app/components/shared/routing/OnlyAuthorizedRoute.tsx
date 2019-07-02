import { RouterState } from "connected-react-router";
import * as queryString from "query-string";
import * as React from "react";
import { Redirect, Route } from "react-router-dom";
import { branch, compose, renderComponent } from "recompose";

import { EUserType } from "../../../lib/api/users/interfaces";
import { selectIsAuthorized, selectUserType } from "../../../modules/auth/selectors";
import { selectWalletTypeFromQueryString } from "../../../modules/routing/selectors";
import { EWalletType } from "../../../modules/web3/types";
import { appConnect } from "../../../store";
import { appRoutes } from "../../appRoutes";
import { loginWalletRoutes } from "../../wallet-selector/walletRoutes";

interface IStateProps {
  isAuthorized: boolean;
  userType?: EUserType;
  walletType: EWalletType;
  routerState: RouterState;
}

interface IOwnProps {
  path: string;
  exact?: boolean;
  investorComponent?: React.ReactType;
  issuerComponent?: React.ReactType;
}

type TProps = IOwnProps & IStateProps;

const selectRouteBasedOnWalletType = (walletType: EWalletType): string => {
  switch (walletType) {
    case EWalletType.LEDGER:
      return loginWalletRoutes.ledger;
    case EWalletType.BROWSER:
      return loginWalletRoutes.browser;
    default:
      return loginWalletRoutes.light;
  }
};

const OnlyAuthorizedRouteRedirectionComponent: React.FunctionComponent<TProps> = ({
  walletType,
  routerState,
  ...rest
}) => {
  const redirectionPath = {
    pathname: selectRouteBasedOnWalletType(walletType),
    search: queryString.stringify({
      redirect: routerState.location.pathname + routerState.location.search,
    }),
  };

  return <Route {...rest} render={() => <Redirect to={redirectionPath} />} />;
};

/**
 * This component will only attempt to redirect on entering the route. So when user gets logged in you need to trigger redirection on your own.
 */
const OnlyAuthorizedRouteComponent: React.FunctionComponent<TProps> = ({
  investorComponent: InvestorComponent,
  issuerComponent: IssuerComponent,
  userType,
  ...rest
}) => {
  switch (userType) {
    case EUserType.INVESTOR:
      return (
        <Route
          {...rest}
          render={props =>
            InvestorComponent ? (
              <InvestorComponent {...props} />
            ) : (
              <Redirect to={appRoutes.dashboard} />
            )
          }
        />
      );

    case EUserType.ISSUER:
      return (
        <Route
          {...rest}
          render={props =>
            IssuerComponent ? <IssuerComponent {...props} /> : <Redirect to={appRoutes.dashboard} />
          }
        />
      );
    default:
      return <div />;
  }
};

export const OnlyAuthorizedRoute = compose<IStateProps & IOwnProps, IOwnProps>(
  appConnect<IStateProps, {}, IOwnProps>({
    stateToProps: state => ({
      isAuthorized: selectIsAuthorized(state.auth),
      userType: selectUserType(state),
      walletType: selectWalletTypeFromQueryString(state),
      routerState: state.router,
    }),
  }),
  branch<IStateProps>(
    (props: IStateProps) => !props.isAuthorized,
    renderComponent(OnlyAuthorizedRouteRedirectionComponent),
  ),
)(OnlyAuthorizedRouteComponent);