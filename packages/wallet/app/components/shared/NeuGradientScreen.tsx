import React from "react";
import { StyleSheet } from "react-native";

import { NeuLinearGradient } from "./NeuLinearGradient";
import { EStatusBarStyle, Screen } from "./Screen";

type TExternalProps = Omit<React.ComponentProps<typeof Screen>, "style" | "contentContainerStyle"> &
  Pick<React.ComponentProps<typeof NeuLinearGradient>, "style">;

const NeuGradientScreen: React.FunctionComponent<TExternalProps> = ({
  children,
  style,
  ...props
}) => (
  <Screen statusBarStyle={EStatusBarStyle.DARK_BLUEY_GRAY} bounces={false} {...props}>
    <NeuLinearGradient style={[styles.gradient, style]}>{children}</NeuLinearGradient>
  </Screen>
);

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export { NeuGradientScreen };
