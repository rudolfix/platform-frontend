import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import Config from "react-native-config";

import { AppAuthRouterTabs } from "./AppAuthRouterTabs";
import { appRoutes } from "./appRoutes";
import { QRCode } from "./components/QRCode";
import { ModalStackHeaderLevel1 } from "./components/shared/modal-header/ModalStackHeaderLevel1";
import { ModalStackHeaderLevel2 } from "./components/shared/modal-header/ModalStackHeaderLevel2";
import { SwitchAccountScreen } from "./components/switch-account/SwitchAccountScreen";
import { WalletConnectSessionScreen } from "./components/wallet-connect-session/WalletConnectSessionScreen";

const Stack = createStackNavigator();

const AppAuthRouter: React.FunctionComponent = () => (
  <>
    <Stack.Navigator
      initialRouteName={appRoutes.home}
      screenOptions={({ route, navigation }) => ({
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerStatusBarHeight: navigation.dangerouslyGetState().routes.includes(route)
          ? 0
          : undefined,
        ...TransitionPresets.ModalPresentationIOS,
      })}
      mode="modal"
      headerMode="screen"
    >
      <Stack.Screen
        name={appRoutes.home}
        component={AppAuthRouterTabs}
        options={{
          headerShown: false,
        }}
      />
      <Stack.Screen
        name={appRoutes.qrCode}
        component={QRCode}
        options={{
          title: "Scan QR code",
          header: ModalStackHeaderLevel2,
        }}
      />
      <Stack.Screen
        name={appRoutes.walletConnectSession}
        component={WalletConnectSessionScreen}
        options={{
          title: "Neufund Web",
          header: ModalStackHeaderLevel1,
        }}
      />
      {Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost" && (
        <Stack.Screen
          name={appRoutes.switchAccount}
          component={SwitchAccountScreen}
          options={{ header: ModalStackHeaderLevel2, title: "Switch account" }}
        />
      )}
    </Stack.Navigator>
  </>
);

export { AppAuthRouter };
