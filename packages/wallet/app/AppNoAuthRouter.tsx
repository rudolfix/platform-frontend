import { assertNever } from "@neufund/shared";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import { appRoutes } from "./appRoutes";
import { ImportWalletScreen } from "./components/import-wallet/ImportWalletScreen";
import { CreateWalletScreen } from "./components/create-wallet/CreateWalletScreen";
import { ModalStackHeader } from "./components/shared/ModalStackHeader";
import { UnlockWalletScreen } from "./components/unlock-wallet/UnlockWalletScreen";
import { EAuthState } from "./modules/auth/reducer";

const NoAuthStack = createStackNavigator();

type TExternalProps = {
  authState: EAuthState.NON_AUTHORIZED_NO_ACCOUNT | EAuthState.NON_AUTHORIZED_HAS_ACCOUNT;
};

const getNoAuthInitialRouteForState = (authState: TExternalProps["authState"]) => {
  switch (authState) {
    case EAuthState.NON_AUTHORIZED_NO_ACCOUNT:
      return appRoutes.createWallet;
    case EAuthState.NON_AUTHORIZED_HAS_ACCOUNT:
      return appRoutes.unlockWallet;
    default:
      assertNever(authState, `Invalid auth state: ${authState}`);
      return;
  }
};

const AppNoAuthRouter: React.FunctionComponent<TExternalProps> = ({ authState }) => (
  <NoAuthStack.Navigator
    initialRouteName={getNoAuthInitialRouteForState(authState)}
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
  </NoAuthStack.Navigator>
);
export { AppNoAuthRouter };
