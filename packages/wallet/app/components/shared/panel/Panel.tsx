import React from "react";
import { StyleSheet, TouchableOpacity, View } from "react-native";

import { baseWhite } from "../../../styles/colors";
import { roundness, shadowStyles } from "../../../styles/common";
import { spacingStyles } from "../../../styles/spacings";

const PanelTouchable: React.FunctionComponent<React.ComponentProps<typeof TouchableOpacity>> = ({
  style,
  children,
  ...props
}) => (
  <TouchableOpacity
    activeOpacity={0.6}
    accessibilityRole="button"
    accessibilityComponentType="button"
    accessibilityTraits="button"
    style={[styles.wrapper, style]}
    {...props}
  >
    {children}
  </TouchableOpacity>
);

const Panel: React.FunctionComponent<React.ComponentProps<typeof View>> = ({
  style,
  children,
  ...props
}) => (
  <View style={[styles.wrapper, style]} {...props}>
    {children}
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    ...shadowStyles.s2,
    ...spacingStyles.p4,
    borderRadius: roundness,
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: baseWhite,
  },
});

export { PanelTouchable, Panel };
