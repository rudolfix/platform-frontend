import { assertNever, StateNotAllowedError } from "@neufund/shared-utils";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import Config from "react-native-config";

import { ImportFixtureScreen } from "components/screens/FixtureScreen/ImportFixtureScreen";
import { ImportAccountScreen } from "components/screens/ImportAccountScreen/ImportAccountScreen";
import { LandingScreen } from "components/screens/LandingScreen/LandingScreen";
import { LostAccountScreen } from "components/screens/LostAccountScreen/LostAccountScreen";
import { UnlockAccountScreen } from "components/screens/UnlockAccountScreen/UnlockAccountScreen";
import { ModalStackHeaderLevel2 } from "components/shared/modal-header/ModalStackHeaderLevel2";

import { EAuthState, TAuthWalletMetadata } from "modules/auth/module";

import { EAppRoutes } from "./appRoutes";
import { RootStackParamList } from "./routeUtils";

const NoAuthStack = createStackNavigator<RootStackParamList>();

type TExternalProps = {
  authWallet: undefined | TAuthWalletMetadata;
  authLostWallet: undefined | TAuthWalletMetadata;
  authState: EAuthState;
};

const getInitialState = (
  authState: EAuthState,
  authWallet: undefined | TAuthWalletMetadata,
  authLostWallet: undefined | TAuthWalletMetadata,
) => {
  if (authLostWallet) {
    return EAppRoutes.lostAccount;
  }

  const hasAnAccountToUnlock = !!authWallet;

  switch (authState) {
    case EAuthState.NOT_AUTHORIZED:
      return hasAnAccountToUnlock ? EAppRoutes.unlockAccount : EAppRoutes.landing;

    case EAuthState.AUTHORIZED:
      throw new StateNotAllowedError("Auth should not be authorized");

    default:
      assertNever(authState, "Invalid auth state");
  }
};
const AppNoAuthRouter: React.FunctionComponent<TExternalProps> = ({
  authState,
  authWallet,
  authLostWallet,
}) => (
  <NoAuthStack.Navigator
    initialRouteName={getInitialState(authState, authWallet, authLostWallet)}
    screenOptions={({ route, navigation }) => ({
      ...TransitionPresets.ModalPresentationIOS,
      gestureEnabled: true,
      cardOverlayEnabled: true,
      headerStatusBarHeight:
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        navigation.dangerouslyGetState().routes.indexOf(route) > 0 ? 0 : undefined,
    })}
    mode="modal"
  >
    <NoAuthStack.Screen
      name={EAppRoutes.landing}
      component={LandingScreen}
      options={{ headerShown: false }}
    />
    <NoAuthStack.Screen
      name={EAppRoutes.unlockAccount}
      component={UnlockAccountScreen}
      options={{ headerShown: false }}
    />
    <NoAuthStack.Screen
      name={EAppRoutes.lostAccount}
      component={LostAccountScreen}
      options={{ headerShown: false }}
    />
    <NoAuthStack.Screen
      name={EAppRoutes.importAccount}
      component={ImportAccountScreen}
      options={{ header: ModalStackHeaderLevel2 }}
    />
    {Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost" && (
      <NoAuthStack.Screen
        name={EAppRoutes.importFixture}
        component={ImportFixtureScreen}
        options={{ header: ModalStackHeaderLevel2, title: "Switch account" }}
      />
    )}
  </NoAuthStack.Navigator>
);
export { AppNoAuthRouter };
