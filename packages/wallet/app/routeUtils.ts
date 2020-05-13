import { StackNavigationProp } from "@react-navigation/stack";
import { NavigationContainerRef } from "@react-navigation/native";
import * as React from "react";
import { EAppRoutes } from "./appRoutes";

const navigationRef = React.createRef<NavigationContainerRef>();

/**
 * undefined means that the route doesn't have params
 * A union type with undefined (SomeType | undefined) means that params are optional
 * example: type LandingScreenNavigationProp = StackNavigationProp<RootStackParamList, EAppRoutes.landing'>;
 */
export type RootStackParamList = {
  [EAppRoutes.landing]: undefined;
  [EAppRoutes.importAccount]: undefined;
  [EAppRoutes.unlockAccount]: undefined;
  [EAppRoutes.switchAccount]: undefined;
  [EAppRoutes.home]: undefined;
  [EAppRoutes.portfolio]: undefined;
  [EAppRoutes.wallet]: undefined;
  [EAppRoutes.profile]: undefined;
  [EAppRoutes.qrCode]: undefined;
};

const navigate = (name: string, params?: StackNavigationProp<RootStackParamList>) => {
  navigationRef.current?.navigate(name, params);
};

export { navigate, navigationRef };
