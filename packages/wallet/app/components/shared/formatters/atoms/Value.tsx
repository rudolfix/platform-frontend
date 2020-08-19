import * as React from "react";
import { Text } from "react-native";

export const Value: React.FunctionComponent = ({ children }) => (
  <Text data-test-id="value">{children}</Text>
);
