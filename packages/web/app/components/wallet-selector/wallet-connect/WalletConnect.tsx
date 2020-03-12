import { withContainer } from "@neufund/shared";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import {  compose } from "recompose";

import { actions } from "../../../modules/actions";
import { ELogoutReason } from "../../../modules/auth/types";
import { TLoginRouterState } from "../../../modules/routing/types";
import { appConnect } from "../../../store";
import { TransitionalLayout } from "../../layouts/Layout";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { resetWalletOnLeave } from "../resetWallet";
import { WalletConnectLayout } from "./WalletConnectLayout";
import { selectMessageSigningError } from "../../../modules/wallet-selector/selectors";

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
  walletConnectStart: () => void;
  walletConnectStop: () => void;
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
    stateToProps: state => ({
      error: selectMessageSigningError(state)
    }),
    dispatchToProps: dispatch => ({
      walletConnectStart: () => dispatch(actions.walletSelector.walletConnectStart()),
      walletConnectStop: () => dispatch(actions.walletSelector.walletConnectStop()),
    }),
  }),
  resetWalletOnLeave(),
  withContainer(TransitionalLayout),
)(WalletConnectLayout);
