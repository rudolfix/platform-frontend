import { assertNever } from "@neufund/shared";
import React from "react";
import { StyleSheet, Text, TouchableHighlight } from "react-native";

import {
  baseGray,
  baseWhite,
  baseYellow,
  blueyGrey,
  grayLighter4,
  silverLighter1,
  yellowDarker1,
} from "../../../styles/colors";
import { typographyStyles } from "../../../styles/typography";
import { Touchable } from "../Touchable";

enum EButtonLayout {
  PRIMARY = "primary",
  SECONDARY = "secondary",
  TEXT = "text",
}

type TTouchableProps = React.ComponentProps<typeof Touchable>;

type TExternalProps = { layout: EButtonLayout } & Omit<TTouchableProps, "activeColor">;

const getButtonStyle = (layout: EButtonLayout) => {
  switch (layout) {
    case EButtonLayout.PRIMARY:
      return styles.buttonPrimary;
    case EButtonLayout.SECONDARY:
      return styles.buttonSecondary;
    case EButtonLayout.TEXT:
      return styles.buttonText;
    default:
      assertNever(layout);
  }
};

/*
 * A button that aligns with our design system.
 */
const Button = React.forwardRef<TouchableHighlight, TExternalProps>(
  ({ layout, children, ...props }, ref) => {
    return (
      <Touchable
        ref={ref}
        style={[
          styles.buttonCommon,
          getButtonStyle(layout),
          props.disabled && styles.buttonCommonDisabled,
        ]}
        activeColor={yellowDarker1}
        accessibilityRole="button"
        accessibilityComponentType="button"
        accessibilityTraits={props.disabled ? ["button", "disabled"] : "button"}
        accessibilityStates={props.disabled ? ["disabled"] : []}
        {...props}
      >
        <Text
          style={[styles.buttonCommonLabel, props.disabled && styles.buttonCommonDisabledLabel]}
        >
          {children}
        </Text>
      </Touchable>
    );
  },
);

const styles = StyleSheet.create({
  // Common button styles
  buttonCommon: {
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    alignItems: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonCommonLabel: {
    ...typographyStyles.label,
    color: baseGray,
  },
  buttonCommonDisabled: {
    borderColor: silverLighter1,
    backgroundColor: silverLighter1,
  },
  buttonCommonDisabledLabel: {
    color: blueyGrey,
  },

  // Primary button
  buttonPrimary: {
    borderColor: baseYellow,
    backgroundColor: baseYellow,
  },

  // Secondary button
  buttonSecondary: {
    borderColor: grayLighter4,
    backgroundColor: baseWhite,
  },

  // Text button
  buttonText: {
    borderColor: "transparent",
    backgroundColor: "transparent",
  },
});

export { Button, EButtonLayout };
