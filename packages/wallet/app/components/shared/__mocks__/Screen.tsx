import * as React from "react";
import { View } from "react-native";

const SafeAreaScreen: React.FunctionComponent = ({ children, ...prop }) => (
  <View testID="safe-area-screen" {...prop}>
    {children}
  </View>
);

const Screen: React.FunctionComponent = ({ children, ...prop }) => (
  <View testID="screen" {...prop}>
    {children}
  </View>
);

export { SafeAreaScreen, Screen };
