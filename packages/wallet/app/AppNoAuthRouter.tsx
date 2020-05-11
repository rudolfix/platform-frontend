import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import { TAuthWalletMetadata } from "modules/auth/module";
import React from "react";
import Config from "react-native-config";

import { appRoutes } from "./appRoutes";
import { ImportAccountScreen } from "./components/import-account/ImportAccountScreen";
import { LandingScreen } from "./components/landing/LandingScreen";
import { ModalStackHeader } from "./components/shared/ModalStackHeader";
import { SwitchAccountScreen } from "./components/switch-account/SwitchAccountScreen";
import { UnlockAccountScreen } from "./components/unlock-account/UnlockAccountScreen";

const NoAuthStack = createStackNavigator();

type TExternalProps = {
  authWallet: undefined | TAuthWalletMetadata;
};

const AppNoAuthRouter: React.FunctionComponent<TExternalProps> = ({ authWallet }) => {
  const hasAnAccountToUnlock = !!authWallet;

  return (
    <NoAuthStack.Navigator
      initialRouteName={hasAnAccountToUnlock ? appRoutes.unlockAccount : appRoutes.landing}
      screenOptions={({ route, navigation }) => ({
        ...TransitionPresets.ModalPresentationIOS,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerStatusBarHeight:
          navigation.dangerouslyGetState().routes.indexOf(route) > 0 ? 0 : undefined,
      })}
      mode="modal"
    >
      <NoAuthStack.Screen
        name={appRoutes.landing}
        component={LandingScreen}
        options={{ headerShown: false }}
      />
      <NoAuthStack.Screen
        name={appRoutes.unlockAccount}
        component={UnlockAccountScreen}
        options={{ headerShown: false }}
      />
      <NoAuthStack.Screen
        name={appRoutes.importAccount}
        component={ImportAccountScreen}
        options={{ header: ModalStackHeader }}
      />
      {Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost" && (
        <NoAuthStack.Screen
          name={appRoutes.switchAccount}
          component={SwitchAccountScreen}
          options={{ header: ModalStackHeader, title: "Switch account" }}
        />
      )}
    </NoAuthStack.Navigator>
  );
};
export { AppNoAuthRouter };
