import React from "react";
import { StyleSheet, TouchableOpacity } from "react-native";

import { baseGray, blueyGray } from "../../../styles/colors";
import { st } from "../../utils";
import { EIconType, Icon } from "../Icon";
import { LoadingIndicator } from "../LoadingIndicator";
import { BodyBoldText } from "../typography/BodyText";

type TTouchableProps = React.ComponentProps<typeof TouchableOpacity>;

type TExternalProps = {
  icon: EIconType;
  loading?: boolean;
  // force accessibility label to be always provided by a developer
  accessibilityLabel: string;
} & Omit<TTouchableProps, "activeOpacity" | "underlayColor" | "children">;

/**
 * A button icon that aligns with our design system.
 */
const ButtonIcon = React.forwardRef<TouchableOpacity, TExternalProps>(
  ({ icon, style, loading, disabled, accessibilityLabel, ...props }, ref) => {
    const isDisabled = disabled || loading;

    return (
      <TouchableOpacity
        ref={ref}
        activeOpacity={0.4}
        style={[styles.buttonCommon, style]}
        accessibilityRole="button"
        accessibilityComponentType="button"
        accessibilityTraits={isDisabled ? ["button", "disabled"] : "button"}
        accessibilityStates={isDisabled ? ["disabled"] : []}
        accessibilityLabel={accessibilityLabel}
        disabled={isDisabled}
        {...props}
      >
        <BodyBoldText>
          {/* We need empty spaces to force the same button icon size */}&nbsp;
        </BodyBoldText>
        {loading ? (
          <LoadingIndicator />
        ) : (
          <Icon
            type={icon}
            style={st(styles.buttonCommonLabel, [isDisabled, styles.buttonCommonDisabledLabel])}
          />
        )}
        <BodyBoldText>
          {/* We need empty spaces to force the same button icon size */}&nbsp;
        </BodyBoldText>
      </TouchableOpacity>
    );
  },
);

const styles = StyleSheet.create({
  // Common button icon styles
  buttonCommon: {
    borderRadius: 4,
    borderWidth: 1,
    borderStyle: "solid",
    borderColor: "transparent",
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingTop: 12,
    paddingBottom: 10,
    paddingLeft: 10,
    paddingRight: 10,
  },
  buttonCommonLabel: {
    color: baseGray,
    width: 24,
    height: 24,
  },
  buttonCommonDisabledLabel: {
    color: blueyGray,
  },
});

export { ButtonIcon };
