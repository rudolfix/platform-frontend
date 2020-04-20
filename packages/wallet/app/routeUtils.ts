import { NavigationContainerRef } from "@react-navigation/native";
import * as React from "react";

const navigationRef = React.createRef<NavigationContainerRef>();

// TODO: Improve type safety of routes
// eslint-disable-next-line @typescript-eslint/no-explicit-any
const navigate = (name: string, params?: any) => {
  navigationRef.current?.navigate(name, params);
};

export { navigate, navigationRef };
