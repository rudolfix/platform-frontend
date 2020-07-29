import { assertNever, UnknownObject } from "@neufund/shared-utils";
import React from "react";
import { LayoutAnimation } from "react-native";
import { compose } from "recompose";

import { ErrorBoundaryScreen } from "components/screens/ErrorBoundaryScreen/ErrorBoundaryScreen";
import { HomeScreenLayout } from "components/screens/HomeScreen/HomeScreenLayout";
import { HomeScreenLayoutSkeleton } from "components/screens/HomeScreen/HomeScreenLayoutSkeleton";
import { createErrorBoundary } from "components/shared/error-boundary/ErrorBoundary";
import { onLifecycle } from "components/shared/hocs/onLifecycle";

import { usePrevious } from "hooks/usePrevious";

import { homeScreenModuleApi } from "modules/home-screen/module";
import { EScreenState } from "modules/types";

import { appConnect } from "store/utils";

type TStateProps = ReturnType<typeof homeScreenModuleApi.selectors.selectHomeScreenData>;

const HomeScreenSwitch: React.FunctionComponent<TStateProps> = props => {
  const previousViewState = usePrevious(props.screenState);

  React.useLayoutEffect(() => {
    if (previousViewState === EScreenState.LOADING && props.screenState === EScreenState.READY) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }
  }, [props.screenState, previousViewState]);

  switch (props.screenState) {
    case EScreenState.INITIAL:
    case EScreenState.LOADING:
      return <HomeScreenLayoutSkeleton />;

    case EScreenState.READY:
    case EScreenState.REFRESHING:
      return <HomeScreenLayout {...props} />;

    case EScreenState.ERROR:
      return <ErrorBoundaryScreen />;

    default:
      assertNever(props);
  }
};

export const HomeScreen = compose<TStateProps, UnknownObject>(
  createErrorBoundary(ErrorBoundaryScreen),
  appConnect<TStateProps>({
    stateToProps: state => homeScreenModuleApi.selectors.selectHomeScreenData(state),
  }),
  onLifecycle({
    onMount: dispatch => dispatch(homeScreenModuleApi.actions.loadHomeScreen()),
    onFocus: dispatch => dispatch(homeScreenModuleApi.actions.refreshHomeScreen()),
  }),
)(HomeScreenSwitch);
