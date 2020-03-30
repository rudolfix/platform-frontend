import { NavigationContainer } from "@react-navigation/native";
import { createStackNavigator } from "@react-navigation/stack";
import React from "react";

import { appRoutes } from "./appRoutes";
import { Dashboard } from "./components/Dashboard";
import { ImportWallet } from "./components/ImportWallet";
import { Landing } from "./components/Landing";
import { QRCode } from "./components/QRCode";
import { navigationRef } from "./routeUtils";

const Stack = createStackNavigator();

const AppRouter: React.FunctionComponent = () => (
  <NavigationContainer ref={navigationRef}>
    <Stack.Navigator initialRouteName={appRoutes.landing}>
      <Stack.Screen name={appRoutes.landing} component={Landing} />
      <Stack.Screen name={appRoutes.qrCode} component={QRCode} />
      <Stack.Screen name={appRoutes.dashboard} component={Dashboard} />
      <Stack.Screen name={appRoutes.importWallet} component={ImportWallet} />
    </Stack.Navigator>
  </NavigationContainer>
);

export { AppRouter };
