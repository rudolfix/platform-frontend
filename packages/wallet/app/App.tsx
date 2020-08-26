import { assertNever, StateNotAllowedError } from "@neufund/shared-utils";
import { NavigationContainer } from "@react-navigation/native";
import React from "react";
import { InteractionManager } from "react-native";
import RNBootSplash from "react-native-bootsplash";

import { CriticalError } from "components/CriticalError";
import { FaceIDPermissionModal } from "components/modals/FaceIDPermissionModal/FaceIDPermissionModal";
import { SignerModal } from "components/modals/SignerModal/SignerModal";

import { usePrevious } from "hooks/usePrevious";

import { authModuleAPI, EAuthState } from "modules/auth/module";
import { biometryModuleApi } from "modules/biometry/module";
import { EBiometricsState } from "modules/biometry/reducer";
import { EInitStatus, initModuleApi } from "modules/init/module";

import { AppAuthRouter } from "router/AppAuthRouter";
import { AppNoAuthRouter } from "router/AppNoAuthRouter";
import { BiometricsRoute } from "router/BiometricsRouter";
import { navigationRef } from "router/routeUtils";

import { appConnect } from "store/utils";

import { useTheme } from "themes/ThemeProvider";

type TStateProps = {
  initStatus: ReturnType<typeof initModuleApi.selectors.selectInitStatus>;
  authState: ReturnType<typeof authModuleAPI.selectors.selectAuthState>;
  authWallet: ReturnType<typeof authModuleAPI.selectors.selectAuthWallet>;
  biometricsState: ReturnType<typeof biometryModuleApi.selectors.selectBiometricsState>;
};

type TDispatchProps = {
  init: () => void;
};

type TLayoutProps = TStateProps & TDispatchProps;

const BiometricsGuards: React.FunctionComponent<Pick<
  TLayoutProps,
  "authState" | "authWallet" | "biometricsState"
>> = ({ authState, authWallet, biometricsState }) => {
  switch (biometricsState) {
    case EBiometricsState.ACCESS_ALLOWED:
    case EBiometricsState.ACCESS_REQUEST_REQUIRED:
      return <AuthorizedGuards authState={authState} authWallet={authWallet} />;
    case EBiometricsState.NO_SUPPORT:
    case EBiometricsState.NO_ACCESS:
      return <BiometricsRoute biometricsState={biometricsState} />;
    case EBiometricsState.UNKNOWN:
      throw new StateNotAllowedError("Biometrics should be initialized");
    default:
      assertNever(biometricsState, "Invalid biometrics state");
  }
};

const AuthorizedGuards: React.FunctionComponent<Pick<TLayoutProps, "authState" | "authWallet">> = ({
  authState,
  authWallet,
}) => {
  switch (authState) {
    case EAuthState.NOT_AUTHORIZED:
    case EAuthState.AUTHORIZING:
      return <AppNoAuthRouter authWallet={authWallet} />;
    case EAuthState.AUTHORIZED:
      return (
        <>
          <AppAuthRouter />

          <SignerModal />
          <FaceIDPermissionModal />
        </>
      );
    default:
      assertNever(authState, "Invalid auth state");
  }
};

const AppLayout: React.FunctionComponent<TLayoutProps> = ({
  init,
  authState,
  authWallet,
  initStatus,
  biometricsState,
}) => {
  const { navigationTheme } = useTheme();
  const previousInitStatus = usePrevious(initStatus);

  React.useEffect(() => {
    init();
  }, [init]);

  React.useEffect(() => {
    if (previousInitStatus === EInitStatus.IN_PROGRESS) {
      // wait for all interactions to finish before showing app
      // otherwise for a moment a white screen will appear for a user
      // eslint-disable-next-line @typescript-eslint/no-floating-promises
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
          <BiometricsGuards
            biometricsState={biometricsState}
            authState={authState}
            authWallet={authWallet}
          />
        </NavigationContainer>
      );
    case EInitStatus.ERROR:
      return <CriticalError />;
    default:
      assertNever(initStatus, "Invalid init status");
  }
};

const App = appConnect<TStateProps, TDispatchProps>({
  stateToProps: state => ({
    initStatus: initModuleApi.selectors.selectInitStatus(state),
    authState: authModuleAPI.selectors.selectAuthState(state),
    authWallet: authModuleAPI.selectors.selectAuthWallet(state),
    biometricsState: biometryModuleApi.selectors.selectBiometricsState(state),
  }),
  dispatchToProps: dispatch => ({
    init: () => dispatch(initModuleApi.actions.start()),
  }),
})(AppLayout);

export { App };
