import * as React from "react";
import { NavigationContainerRef } from "@react-navigation/native";

const navigationRef = React.createRef<NavigationContainerRef>();

// TODO: Improve type safety of routes
const navigate = (name: string, params?: any) => {
  navigationRef.current?.navigate(name, params);
};

export { navigate, navigationRef };
