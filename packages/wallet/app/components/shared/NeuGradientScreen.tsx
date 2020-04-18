import React from "react";
import { StyleSheet } from "react-native";

import { NeuLinearGradient } from "./NeuLinearGradient";
import { Screen } from "./Screen";

type TExternalProps = React.ComponentProps<typeof Screen>;

const NeuGradientScreen: React.FunctionComponent<TExternalProps> = ({
  children,
  style,
  contentContainerStyle,
  ...props
}) => {
  return (
    <Screen statusBarStyle="light-content" {...props}>
      <NeuLinearGradient style={[styles.gradient, contentContainerStyle, style]}>
        {children}
      </NeuLinearGradient>
    </Screen>
  );
};

const styles = StyleSheet.create({
  gradient: {
    flex: 1,
  },
});

export { NeuGradientScreen };
