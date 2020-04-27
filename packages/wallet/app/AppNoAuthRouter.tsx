import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import Config from "react-native-config";

import { appRoutes } from "./appRoutes";
import { CreateAccountScreen } from "./components/create-account/CreateAccountScreen";
import { ImportAccountScreen } from "./components/import-account/ImportAccountScreen";
import { ModalStackHeaderLevel2 } from "./components/shared/modal-header/ModalStackHeaderLevel2";
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
        options={{ header: ModalStackHeaderLevel2 }}
      />
      {Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost" && (
        <NoAuthStack.Screen
          name={appRoutes.switchAccount}
          component={SwitchAccountScreen}
          options={{ header: ModalStackHeaderLevel2, title: "Switch account" }}
        />
      )}
    </NoAuthStack.Navigator>
  );
};
export { AppNoAuthRouter };
