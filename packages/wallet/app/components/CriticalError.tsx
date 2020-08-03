import * as React from "react";
import { Text } from "react-native";

const CriticalError: React.FunctionComponent = () => (
  <Text testID="critical-error">Critical error occurred</Text>
);

export { CriticalError };
