import React from "react";
import { StyleProp, StyleSheet, TouchableOpacity, View, ViewStyle } from "react-native";

import { Shadow2 } from "components/shared/shadow/Shadow";

import { baseWhite } from "styles/colors";
import { roundness } from "styles/common";
import { spacingStyles } from "styles/spacings";

type TExternalProps = {
  contentContainerStyle?: StyleProp<ViewStyle>;
};

const PanelTouchable: React.FunctionComponent<
  TExternalProps & React.ComponentProps<typeof TouchableOpacity>
> = ({ style, children, contentContainerStyle, ...props }) => (
  <Shadow2 style={[styles.wrapper, style]}>
    <TouchableOpacity
      activeOpacity={0.6}
      accessibilityComponentType="button"
      accessibilityTraits="button"
      {...props}
    >
      <View style={[styles.innerWrapper, contentContainerStyle]}>{children}</View>
    </TouchableOpacity>
  </Shadow2>
);

const Panel: React.FunctionComponent<TExternalProps & React.ComponentProps<typeof View>> = ({
  style,
  children,
  contentContainerStyle,
  ...props
}) => (
  <Shadow2 style={[styles.wrapper, style]} {...props}>
    <View style={[styles.innerWrapper, contentContainerStyle]}>{children}</View>
  </Shadow2>
);

const styles = StyleSheet.create({
  wrapper: {
    borderRadius: roundness,
    backgroundColor: baseWhite,
  },
  innerWrapper: {
    ...spacingStyles.p4,

    overflow: "hidden",
  },
});

export { PanelTouchable, Panel };
