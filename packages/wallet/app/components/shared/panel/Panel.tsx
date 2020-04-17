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
    <View style={styles.innerWrapper}>{children}</View>
  </TouchableOpacity>
);

const Panel: React.FunctionComponent<React.ComponentProps<typeof View>> = ({
  style,
  children,
  ...props
}) => (
  <View style={[styles.wrapper, style]} {...props}>
    <View style={styles.innerWrapper}>{children}</View>
  </View>
);

const styles = StyleSheet.create({
  wrapper: {
    ...shadowStyles.s2,

    borderRadius: roundness,
    backgroundColor: baseWhite,
  },
  innerWrapper: {
    ...spacingStyles.p4,

    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
    overflow: "hidden",
  },
});

export { PanelTouchable, Panel };
