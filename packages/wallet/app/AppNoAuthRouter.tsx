import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import Config from "react-native-config";

import { appRoutes } from "./appRoutes";
import { ImportAccountScreen } from "./components/import-account/ImportAccountScreen";
import { CreateAccountScreen } from "./components/create-account/CreateAccountScreen";
import { ModalStackHeader } from "./components/shared/ModalStackHeader";
import { SwitchAccountScreen } from "./components/switch-account/SwitchAccountScreen";
import { UnlockAccountScreen } from "./components/unlock-account/UnlockAccountScreen";
import { TAuthWalletMetadata } from "./modules/auth/module";

const NoAuthStack = createStackNavigator();

type TExternalProps = {
  authWallet: undefined | TAuthWalletMetadata;
};

const AppNoAuthRouter: React.FunctionComponent<TExternalProps> = ({ authWallet }) => {
  const hasAnAccountToUnlock = !!authWallet;

  return (
    <NoAuthStack.Navigator
      initialRouteName={hasAnAccountToUnlock ? appRoutes.unlockAccount : appRoutes.createAccount}
      screenOptions={({ route, navigation }) => ({
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerStatusBarHeight:
          navigation.dangerouslyGetState().routes.indexOf(route) > 0 ? 0 : undefined,
        ...TransitionPresets.ModalPresentationIOS,
      })}
      mode="modal"
    >
      <NoAuthStack.Screen
        name={appRoutes.createAccount}
        component={CreateAccountScreen}
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
