import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";

import { appRoutes } from "./appRoutes";
import { ImportWalletScreen } from "./components/import-wallet/ImportWalletScreen";
import { CreateWalletScreen } from "./components/create-wallet/CreateWalletScreen";
import { ModalStackHeader } from "./components/shared/ModalStackHeader";
import { SwitchAccountScreen } from "./components/switch-account/SwitchAccountScreen";
import { UnlockWalletScreen } from "./components/unlock-wallet/UnlockWalletScreen";
import { TAuthWalletMetadata } from "./modules/auth/module";

const NoAuthStack = createStackNavigator();

type TExternalProps = {
  authWallet: undefined | TAuthWalletMetadata;
};

const AppNoAuthRouter: React.FunctionComponent<TExternalProps> = ({ authWallet }) => {
  const hasAnAccountToUnlock = !!authWallet;

  return (
    <NoAuthStack.Navigator
      initialRouteName={hasAnAccountToUnlock ? appRoutes.unlockWallet : appRoutes.createWallet}
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
        name={appRoutes.createWallet}
        component={CreateWalletScreen}
        options={{ headerShown: false }}
      />
      <NoAuthStack.Screen
        name={appRoutes.unlockWallet}
        component={UnlockWalletScreen}
        options={{ headerShown: false }}
      />
      <NoAuthStack.Screen
        name={appRoutes.importWallet}
        component={ImportWalletScreen}
        options={{ header: ModalStackHeader }}
      />
      <NoAuthStack.Screen
        name={appRoutes.switchAccount}
        component={SwitchAccountScreen}
        options={{ header: ModalStackHeader, title: "Switch account" }}
      />
    </NoAuthStack.Navigator>
  );
};
export { AppNoAuthRouter };
