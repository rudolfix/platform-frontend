import { NavigationContainer } from "@react-navigation/native";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import React from "react";
import { Text } from "react-native";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";

import { appRoutes, tabConfig } from "./appRoutes";
import { QRCode } from "./components/QRCode";
import { Icon } from "./components/shared/Icon";
import { navigationRef } from "./routeUtils";
import { typographyStyles } from "./styles/typography";
import { useTheme } from "./themes/ThemeProvider";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

type TBarProps = { color?: string };

const Root: React.FunctionComponent = () => {
  const { navigationTheme } = useTheme();

  return (
    <Tab.Navigator
      initialRouteName={appRoutes.home}
      tabBarOptions={{
        inactiveTintColor: navigationTheme.colors.text,
      }}
    >
      {tabConfig.map(({ route, name, component, icon }) => (
        <Tab.Screen
          key={route}
          name={name}
          component={component}
          options={{
            tabBarLabel: ({ color }: TBarProps) => (
              <Text style={{ ...typographyStyles.menuLabel, color }}>{name}</Text>
            ),
            tabBarIcon: ({ color }: TBarProps) => <Icon color={color} type={icon} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const AppRouter: React.FunctionComponent = () => {
  const { navigationTheme } = useTheme();

  return (
    <NavigationContainer ref={navigationRef} theme={navigationTheme}>
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
          component={Root}
          options={{
            title: "Back",
            headerShown: false,
          }}
        />
        <Stack.Screen
          name={appRoutes.qrCode}
          component={QRCode}
          options={{
            title: "Scan QR code",
            headerShown: true,
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export { AppRouter };
