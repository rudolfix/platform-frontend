import { assertNever, UnknownObject } from "@neufund/shared-utils";
import React from "react";
import { LayoutAnimation } from "react-native";
import { compose } from "recompose";

import { ErrorBoundaryScreen } from "components/screens/ErrorBoundaryScreen/ErrorBoundaryScreen";
import { PortfolioScreenLayoutSkeleton } from "components/screens/PortfolioScreen/PortfolioScreenSkeleton";
import { createErrorBoundary } from "components/shared/error-boundary/ErrorBoundary";
import { onLifecycle } from "components/shared/hocs/onLifecycle";

import { usePrevious } from "hooks/usePrevious";

import { portfolioScreenModuleApi } from "modules/portfolio-screen/module";
import { EScreenState } from "modules/types";

import { appConnect } from "store/utils";

import { PortfolioScreenLayout } from "./PortfolioScreenLayout";

type TStateProps = ReturnType<typeof portfolioScreenModuleApi.selectors.selectPortfolioScreenData>;

const PortfolioScreenSwitch: React.FunctionComponent<TStateProps> = props => {
  const previousViewState = usePrevious(props.screenState);

  React.useLayoutEffect(() => {
    if (previousViewState === EScreenState.LOADING && props.screenState === EScreenState.READY) {
      LayoutAnimation.configureNext(LayoutAnimation.Presets.linear);
    }
  }, [props.screenState, previousViewState]);

  switch (props.screenState) {
    case EScreenState.INITIAL:
    case EScreenState.LOADING:
      return <PortfolioScreenLayoutSkeleton />;

    case EScreenState.READY:
    case EScreenState.REFRESHING:
      return <PortfolioScreenLayout {...props} />;

    case EScreenState.ERROR:
      return <ErrorBoundaryScreen />;

    default:
      assertNever(props);
  }
};

const PortfolioScreen = compose<TStateProps, UnknownObject>(
  createErrorBoundary(ErrorBoundaryScreen),
  appConnect<TStateProps>({
    stateToProps: state => portfolioScreenModuleApi.selectors.selectPortfolioScreenData(state),
  }),
  onLifecycle({
    onMount: dispatch => dispatch(portfolioScreenModuleApi.actions.loadPortfolioScreen()),
    onFocus: dispatch => dispatch(portfolioScreenModuleApi.actions.refreshPortfolioScreen()),
  }),
)(PortfolioScreenSwitch);

export { PortfolioScreen };
