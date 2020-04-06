import { withContainer } from "@neufund/shared";
import { StaticContext } from "react-router";
import { RouteComponentProps } from "react-router-dom";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../modules/actions";
import { ELogoutReason } from "../../../modules/auth/types";
import { TLoginRouterState } from "../../../modules/routing/types";
import {
  selectMessageSigningError,
  selectWalletConnectError,
} from "../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../store";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary.unsafe";
import { ErrorBoundaryLayout } from "../../shared/errorBoundary/ErrorBoundaryLayout";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { shouldNeverHappen } from "../../shared/NeverComponent";
import { TMessage } from "../../translatedMessages/utils";
import { WalletConnectContainer, WalletConnectError } from "./WalletConnectLayout";

type TRouteLoginProps = RouteComponentProps<unknown, StaticContext, TLoginRouterState>;

type TExternalProps = {
  isSecretProtected: boolean;
} & TRouteLoginProps;

type TStateProps = {
  error: TMessage | undefined;
};

type TDispatchProps = {
  walletConnectStart: () => void;
  walletConnectStop: () => void;
};

type TLocalStateProps = {
  logoutReason: ELogoutReason | undefined;
};

type TLocalStateHandlersProps = {
  hideLogoutReason: () => Partial<TLocalStateProps> | undefined;
};

export const WalletConnect = compose<
  TExternalProps & TStateProps & TDispatchProps & TLocalStateHandlersProps & TLocalStateProps,
  {}
>(
  createErrorBoundary(ErrorBoundaryLayout),
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => ({
      error: selectWalletConnectError(state) || selectMessageSigningError(state),
    }),
    dispatchToProps: dispatch => ({
      walletConnectStart: () => dispatch(actions.walletSelector.walletConnectStart()),
      walletConnectStop: () => dispatch(actions.walletSelector.walletConnectStop()),
    }),
  }),
  withContainer(WalletConnectContainer),
  branch<TStateProps>(
    ({ error }) => error === undefined,
    renderComponent(LoadingIndicator),
    renderComponent(WalletConnectError),
  ),
)(shouldNeverHappen("WalletConnect reached default branch"));
