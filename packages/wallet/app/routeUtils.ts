import { NavigationContainerRef } from "@react-navigation/native";
import * as React from "react";

const navigationRef = React.createRef<NavigationContainerRef>();

// TODO: Improve type safety of routes
const navigate = (name: string, params?: any) => {
  navigationRef.current?.navigate(name, params);
};

export type RootStackParamList = {
  WebView: { uri: string };
};

export { navigate, navigationRef };
