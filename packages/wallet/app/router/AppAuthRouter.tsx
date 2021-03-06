import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import Config from "react-native-config";

import { QRCode } from "components/QRCode";
import { AccountBackupScreen } from "components/screens/AccountBackupScreen/AccountBackupScreen";
import { SwitchFixtureScreen } from "components/screens/FixtureScreen/SwitchFixtureScreen";
import { WalletConnectSessionScreen } from "components/screens/WalletConnectSessionScreen/WalletConnectSessionScreen";
import { WebView } from "components/screens/WebViewScreen/WebViewScreen";
import { ModalStackHeaderLevel1 } from "components/shared/modal-header/ModalStackHeaderLevel1";
import { ModalStackHeaderLevel2 } from "components/shared/modal-header/ModalStackHeaderLevel2";

import { AppAuthRouterTabs } from "./AppAuthRouterTabs";
import { EAppRoutes } from "./appRoutes";
import { RootStackParamList } from "./routeUtils";

const Stack = createStackNavigator<RootStackParamList>();

const AppAuthRouter: React.FunctionComponent = () => (
  <>
    <Stack.Navigator
      initialRouteName={EAppRoutes.home}
      screenOptions={({ route, navigation }) => ({
        ...TransitionPresets.ModalPresentationIOS,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-call,@typescript-eslint/no-unsafe-member-access
        headerStatusBarHeight: navigation.dangerouslyGetState().routes.includes(route)
          ? 0
          : undefined,
      })}
      mode="modal"
      headerMode="screen"
    >
      <Stack.Screen
        name={EAppRoutes.home}
        component={AppAuthRouterTabs}
        options={{
          headerShown: false,
        }}
      />

      <Stack.Screen
        name={EAppRoutes.qrCode}
        component={QRCode}
        options={{
          title: "Scan QR code",
          header: ModalStackHeaderLevel2,
        }}
      />

      <Stack.Screen
        name={EAppRoutes.walletConnectSession}
        component={WalletConnectSessionScreen}
        options={{
          title: "Neufund Web",
          header: ModalStackHeaderLevel1,
        }}
      />

      <Stack.Screen
        name={EAppRoutes.accountBackup}
        component={AccountBackupScreen}
        options={{
          title: "Account backup",
          header: ModalStackHeaderLevel1,
        }}
      />

      {Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost" && (
        <Stack.Screen
          name={EAppRoutes.switchToFixture}
          component={SwitchFixtureScreen}
          options={{ header: ModalStackHeaderLevel2, title: "Switch account" }}
        />
      )}

      <Stack.Screen
        name={EAppRoutes.webView}
        component={WebView}
        options={{
          header: ModalStackHeaderLevel2,
        }}
      />
    </Stack.Navigator>
  </>
);

export { AppAuthRouter };
