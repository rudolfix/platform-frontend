import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import { createStackNavigator, TransitionPresets } from "@react-navigation/stack";
import React from "react";
import { Text } from "react-native";
import Config from "react-native-config";

import { appRoutes } from "./appRoutes";
import { HomeScreen } from "./components/home/HomeScreen";
import { PortfolioScreen } from "./components/portfolio/PortfolioScreen";
import { ProfileScreen } from "./components/profile/ProfileScreen";
import { QRCode } from "./components/QRCode";
import { EIconType, Icon } from "./components/shared/Icon";
import { ModalStackHeader } from "./components/shared/ModalStackHeader";
import { SwitchAccountScreen } from "./components/switch-account/SwitchAccountScreen";
import { WalletScreen } from "./components/wallet/WalletScreen";
import { typographyStyles } from "styles/typography";
import { useTheme } from "./themes/ThemeProvider";

const Stack = createStackNavigator();
const Tab = createBottomTabNavigator();

type TBarProps = { color?: string };

const tabConfig = [
  {
    name: "Home",
    route: appRoutes.home,
    component: HomeScreen,
    icon: EIconType.HOME,
  },
  {
    name: "Portfolio",
    route: appRoutes.portfolio,
    component: PortfolioScreen,
    icon: EIconType.PORTFOLIO,
  },
  {
    name: "Wallet",
    route: appRoutes.wallet,
    component: WalletScreen,
    icon: EIconType.WALLET,
  },
  {
    name: "Profile",
    route: appRoutes.profile,
    component: ProfileScreen,
    icon: EIconType.PROFILE,
  },
];

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
            tabBarIcon: ({ color }: TBarProps) => <Icon style={{ color }} type={icon} />,
          }}
        />
      ))}
    </Tab.Navigator>
  );
};

const AppAuthRouter: React.FunctionComponent = () => (
  <>
    <Stack.Navigator
      initialRouteName={appRoutes.home}
      screenOptions={({ route, navigation }) => ({
        ...TransitionPresets.ModalPresentationIOS,
        gestureEnabled: true,
        cardOverlayEnabled: true,
        headerStatusBarHeight: navigation.dangerouslyGetState().routes.includes(route)
          ? 0
          : undefined,
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
          header: ModalStackHeader,
        }}
      />
      {Config.NF_CONTRACT_ARTIFACTS_VERSION === "localhost" && (
        <Stack.Screen
          name={appRoutes.switchAccount}
          component={SwitchAccountScreen}
          options={{ header: ModalStackHeader, title: "Switch account" }}
        />
      )}
    </Stack.Navigator>
  </>
);

export { AppAuthRouter };
