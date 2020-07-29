import { txHistoryApi } from "@neufund/shared-modules";
import { assertNever, UnknownObject } from "@neufund/shared-utils";
import React from "react";
import { LayoutAnimation } from "react-native";
import { compose } from "recompose";

import { ErrorBoundaryScreen } from "components/screens/ErrorBoundaryScreen/ErrorBoundaryScreen";
import { createErrorBoundary } from "components/shared/error-boundary/ErrorBoundary";
import { onLifecycle } from "components/shared/hocs/onLifecycle";

import { usePrevious } from "hooks/usePrevious";

import { EScreenState } from "modules/types";
import { walletScreenModuleApi } from "modules/wallet-screen/module";

import { appConnect } from "store/utils";

import { WalletScreenLayout } from "./WalletScreenLayout";
import { WalletScreenLayoutSkeleton } from "./WalletScreenSkeleton";

type TStateProps = ReturnType<typeof walletScreenModuleApi.selectors.selectWalletScreenData>;

type TDispatchProps = {
  loadTxHistoryNext: () => void;
};

const WalletScreenSwitch: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  screenState,
  ...rest
}) => {
  const previousViewState = usePrevious(screenState);

  React.useLayoutEffect(() => {
    if (previousViewState === EScreenState.LOADING && screenState === EScreenState.READY) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }
  }, [screenState, previousViewState]);

  switch (screenState) {
    case EScreenState.INITIAL:
    case EScreenState.LOADING:
      return <WalletScreenLayoutSkeleton />;

    case EScreenState.READY:
    case EScreenState.REFRESHING:
      return <WalletScreenLayout {...rest} />;

    case EScreenState.ERROR:
      return <ErrorBoundaryScreen />;

    default:
      assertNever(screenState);
  }
};

export const WalletScreen = compose<TStateProps & TDispatchProps, UnknownObject>(
  createErrorBoundary(ErrorBoundaryScreen),
  appConnect<TStateProps, TDispatchProps>({
    stateToProps: state => walletScreenModuleApi.selectors.selectWalletScreenData(state),
    dispatchToProps: dispatch => ({
      loadTxHistoryNext: () => {
        dispatch(txHistoryApi.actions.loadNextTransactions());
      },
    }),
  }),
  onLifecycle({
    onMount: dispatch => dispatch(walletScreenModuleApi.actions.loadWalletScreen()),
    onFocus: dispatch => dispatch(walletScreenModuleApi.actions.refreshWalletScreen()),
  }),
)(WalletScreenSwitch);
