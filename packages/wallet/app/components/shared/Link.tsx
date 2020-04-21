/* eslint-disable react-native-a11y/has-valid-accessibility-traits, react-native-a11y/has-valid-accessibility-states */

import { XOR } from "@neufund/shared-utils";
import * as React from "react";
import { GestureResponderEvent, Linking, StyleSheet, Text, TouchableHighlight } from "react-native";

import { baseGray, grayLighter2 } from "../../styles/colors";
import { typographyStyles } from "../../styles/typography";
import { st } from "../utils";

type TouchableHighlightProps = React.ComponentProps<typeof TouchableHighlight>;
type TExternalProps = XOR<{ url: string }, { onPress: (event: GestureResponderEvent) => void }> &
  Omit<TouchableHighlightProps, "onPress">;

/**
 * An `a` tag alternative for the react-native.
 * Supports either `url` or `onPress` props for handling user interactions.
 */
const Link: React.FunctionComponent<TExternalProps> = React.forwardRef<
  TouchableHighlight,
  TExternalProps
>(({ url, onPress, children, ...props }, ref) => {
  const [isActive, setIsActive] = React.useState(false);

  const onPressHandler = async (e: GestureResponderEvent) => {
    if (url) {
      await Linking.openURL(url);
    }

    if (onPress) {
      onPress(e);
    }
  };

  const onShowUnderlay = () => {
    setIsActive(true);
  };

  const onHideUnderlay = () => {
    setIsActive(false);
  };

  return (
    <TouchableHighlight
      ref={ref}
      style={[styles.link]}
      activeOpacity={1}
      underlayColor="transparent"
      accessibilityComponentType="button"
      accessibilityTraits={props.disabled ? ["link", "disabled"] : "link"}
      accessibilityStates={props.disabled ? ["disabled"] : []}
      onPress={onPressHandler}
      onShowUnderlay={onShowUnderlay}
      onHideUnderlay={onHideUnderlay}
      {...props}
    >
      <Text style={st(styles.linkText, [isActive, styles.linkActiveText])}>{children}</Text>
    </TouchableHighlight>
  );
});

const styles = StyleSheet.create({
  link: {
    alignSelf: "flex-start",
  },
  linkText: {
    ...typographyStyles.text,
    textDecorationLine: "underline",
    color: grayLighter2,
  },
  linkActiveText: {
    color: baseGray,
  },
});

export { Link };
