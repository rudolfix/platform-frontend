import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import {  compose } from "recompose";

import { actions } from "../../../modules/actions";
import { ELogoutReason } from "../../../modules/auth/types";
import { TLoginRouterState } from "../../../modules/routing/types";
import { appConnect } from "../../../store";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { WalletConnectLayout } from "./WalletConnectLayout";
import { selectMessageSigningError, selectWalletConnectError } from "../../../modules/wallet-selector/selectors";
import { TMessage } from "../../translatedMessages/utils";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

type TExternalProps = {
  isSecretProtected: boolean;
} & TRouteLoginProps;

interface IStateProps {
  error: TMessage | undefined
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
      error: selectWalletConnectError(state) || selectMessageSigningError(state)
    }),
    dispatchToProps: dispatch => ({
      walletConnectStart: () => dispatch(actions.walletSelector.walletConnectStart()),
      walletConnectStop: () => dispatch(actions.walletSelector.walletConnectStop()),
    }),
  }),
)(WalletConnectLayout);
