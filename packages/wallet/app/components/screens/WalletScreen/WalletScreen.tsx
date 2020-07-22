import { txHistoryApi } from "@neufund/shared-modules";
import { assertNever, UnknownObject } from "@neufund/shared-utils";
import React from "react";
import { LayoutAnimation } from "react-native";
import { compose } from "recompose";

import { ErrorBoundaryScreen } from "components/screens/ErrorBoundaryScreen/ErrorBoundaryScreen";
import { createErrorBoundary } from "components/shared/error-boundary/ErrorBoundary";
import { onLifecycle } from "components/shared/hocs/onLifecycle";

import { usePrevious } from "hooks/usePrevious";

import { EViewState, walletViewModuleApi } from "modules/wallet-screen/module";

import { appConnect } from "store/utils";

import { WalletScreenLayout, WalletScreenLayoutSkeleton } from "./WalletScreenLayout";

type TStateProps = ReturnType<typeof walletViewModuleApi.selectors.selectWalletViewData>;

type TDispatchProps = {
  loadTxHistoryNext: () => void;
};

const WalletScreenSwitch: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  viewState,
  ...rest
}) => {
  const previousViewState = usePrevious(viewState);

  React.useLayoutEffect(() => {
    if (previousViewState === EViewState.LOADING && viewState === EViewState.READY) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }
  }, [viewState, previousViewState]);

  switch (viewState) {
    case EViewState.INITIAL:
    case EViewState.LOADING:
      return <WalletScreenLayoutSkeleton />;

    case EViewState.READY:
    case EViewState.REFRESHING:
      return <WalletScreenLayout {...rest} />;

    case EViewState.ERROR:
      return <ErrorBoundaryScreen />;

    default:
      assertNever(viewState);
  }
};

export const WalletScreen = compose<TStateProps & TDispatchProps, UnknownObject>(
  createErrorBoundary(ErrorBoundaryScreen),
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => walletViewModuleApi.selectors.selectWalletViewData(state),
    dispatchToProps: dispatch => ({
      loadTxHistoryNext: () => {
        dispatch(txHistoryApi.actions.loadNextTransactions());
      },
    }),
  }),
  onLifecycle({
    onMount: dispatch => dispatch(walletViewModuleApi.actions.loadWalletView()),
    onFocus: dispatch => dispatch(walletViewModuleApi.actions.refreshWalletView()),
  }),
)(WalletScreenSwitch);
