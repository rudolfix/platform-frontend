import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { InteractionManager } from "react-native";
import RNBootSplash from "react-native-bootsplash";

import { AppAuthRouter, AppNoAuthRouter } from "./AppRouter";
import { CriticalError } from "./components/CriticalError";
import { SignerModal } from "./components/signer/SignerModal";
import { usePrevious } from "./hooks/usePrevious";
import { EAuthState } from "./modules/auth/module";
import { selectAuthState } from "./modules/auth/selectors";
import { initActions } from "./modules/init/actions";
import { selectInitStatus } from "./modules/init/selectors";
import { EInitStatus } from "./modules/init/types";
import { navigationRef } from "./routeUtils";
import { appConnect } from "./store/utils";
import { useTheme } from "./themes/ThemeProvider";

type TStateProps = {
  initStatus: ReturnType<typeof selectInitStatus>;
  authState: ReturnType<typeof selectAuthState>;
};

type TDispatchProps = {
  init: () => void;
};

const AppLayout: React.FunctionComponent<TStateProps & TDispatchProps> = ({
  init,
  authState,
  initStatus,
}) => {
  const { navigationTheme } = useTheme();
  const previousInitStatus = usePrevious(initStatus);

  React.useEffect(() => {
    init();
  }, []);

  React.useEffect(() => {
    if (previousInitStatus === EInitStatus.IN_PROGRESS) {
      // wait for all interactions to finish before showing app
      // otherwise for a moment a white screen will appear for a user
      InteractionManager.runAfterInteractions(() => {
        RNBootSplash.hide();
      });
    }
  }, [previousInitStatus]);

  switch (initStatus) {
    case EInitStatus.NOT_STARTER:
    case EInitStatus.IN_PROGRESS:
      // We still show launch screen while init is in progress
      return null;
    case EInitStatus.DONE:
      return (
        <NavigationContainer ref={navigationRef} theme={navigationTheme}>
          {authState === EAuthState.AUTHORIZED ? <AppAuthRouter /> : <AppNoAuthRouter />}

          <SignerModal />
        </NavigationContainer>
      );
    case EInitStatus.ERROR:
      return <CriticalError />;
  }
};

const App = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    initStatus: selectInitStatus(state),
    authState: selectAuthState(state),
  }),
  dispatchToProps: dispatch => ({
    init: () => dispatch(initActions.start()),
  }),
})(AppLayout);

export { App };
