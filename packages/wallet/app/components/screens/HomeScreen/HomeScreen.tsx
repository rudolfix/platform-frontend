import { assertNever, UnknownObject } from "@neufund/shared-utils";
import React from "react";
import { LayoutAnimation } from "react-native";
import { compose } from "recompose";

import { ErrorBoundaryScreen } from "components/screens/ErrorBoundaryScreen/ErrorBoundaryScreen";
import {
  HomeScreenLayout,
  HomeScreenLayoutSkeleton,
} from "components/screens/HomeScreen/HomeScreenLayout";
import { createErrorBoundary } from "components/shared/error-boundary/ErrorBoundary";
import { onLifecycle } from "components/shared/hocs/onLifecycle";

import { usePrevious } from "hooks/usePrevious";

import { homeViewModuleApi, EViewState } from "modules/home-screen/module";

import { appConnect } from "store/utils";

type TStateProps = ReturnType<typeof homeViewModuleApi.selectors.selectHomeViewData>;

const HomeScreenSwitch: React.FunctionComponent<TStateProps> = ({ viewState, ...rest }) => {
  const previousViewState = usePrevious(viewState);

  React.useLayoutEffect(() => {
    if (previousViewState === EViewState.LOADING && viewState === EViewState.READY) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }
  }, [viewState, previousViewState]);

  switch (viewState) {
    case EViewState.INITIAL:
    case EViewState.LOADING:
      return <HomeScreenLayoutSkeleton />;

    case EViewState.READY:
    case EViewState.REFRESHING:
      return <HomeScreenLayout {...rest} />;

    case EViewState.ERROR:
      return <ErrorBoundaryScreen />;

    default:
      assertNever(viewState);
  }
};

export const HomeScreen = compose<TStateProps, UnknownObject>(
  createErrorBoundary(ErrorBoundaryScreen),
  appConnect<TStateProps>({
    stateToProps: state => {
      return homeViewModuleApi.selectors.selectHomeViewData(state);
    },
  }),
  onLifecycle({
    onMount: dispatch => dispatch(homeViewModuleApi.actions.loadHomeView()),
    onFocus: dispatch => dispatch(homeViewModuleApi.actions.refreshHomeView()),
  }),
)(HomeScreenSwitch);
