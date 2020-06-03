import { XOR } from "@neufund/shared-utils";
import * as React from "react";
import { GestureResponderEvent, Linking, StyleSheet, Text } from "react-native";

import { st } from "components/utils";

type TextProps = React.ComponentProps<typeof Text>;

type TExternalProps = XOR<{ url: string }, { onPress: (event: GestureResponderEvent) => void }> &
  Omit<TextProps, "onPress">;

/**
 * An `a` tag alternative for the react-native.
 * Supports either `url` or `onPress` props for handling user interactions.
 */
const Link: React.FunctionComponent<TExternalProps> = React.forwardRef<Text, TExternalProps>(
  ({ url, onPress, children, ...props }, ref) => {
    const onPressHandler = async (e: GestureResponderEvent) => {
      if (url) {
        await Linking.openURL(url);
      }

      if (onPress) {
        onPress(e);
      }
    };

    return (
      <Text
        ref={ref}
        accessibilityComponentType="button"
        accessibilityTraits="link"
        onPress={onPressHandler}
        style={st(styles.link)}
        {...props}
      >
        {children}
      </Text>
    );
  },
);

const styles = StyleSheet.create({
  link: {
    textDecorationLine: "underline",
  },
});

export { Link };
