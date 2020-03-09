import { withContainer } from "@neufund/shared";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import {  compose } from "recompose";

import { ELogoutReason } from "../../modules/auth/types";
import { TLoginRouterState } from "../../modules/routing/types";
import { TransitionalLayout } from "../layouts/Layout";
import { createErrorBoundary } from "../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../shared/errorBoundary/ErrorBoundaryLayout";
import { resetWalletOnLeave } from "./resetWallet";
import { WalletConnectLayout } from "./WalletConnectLayout";
import { appConnect } from "../../store";
import { actions } from "../../modules/actions";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

type TExternalProps = {
  isSecretProtected: boolean;
} & TRouteLoginProps;

interface IStateProps {
  isAuthorized: boolean;
  isMessageSigning: boolean;
  rootPath: string;
  isLoginRoute: boolean;
  oppositeRoute: string;
  userType: string;
}

interface IDispatchProps {
  openICBMModal: () => void;
}

type TLocalStateProps = {
  logoutReason: ELogoutReason | undefined;
};

type TLocalStateHandlersProps = {
  hideLogoutReason: () => Partial<TLocalStateProps> | undefined;
};

export const WalletConnect = compose<
  TExternalProps & IStateProps & IDispatchProps & TLocalStateHandlersProps & TLocalStateProps,
  {}
>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<IStateProps, IDispatchProps>({
    dispatchToProps: dispatch => ({
      connectToBridge: () => dispatch(actions.walletSelector.connectToBridge()),
    }),
  }),
  resetWalletOnLeave(),
  withContainer(TransitionalLayout),
)(WalletConnectLayout);
