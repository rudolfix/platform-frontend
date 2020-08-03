import * as React from "react";
import { StyleSheet, Text } from "react-native";

import { black } from "styles/colors";
import { typographyStyles } from "styles/typography";

type TExternalProps = React.ComponentProps<typeof Text>;

/**
 * An code text component that aligns with our design system
 * Use when text should be formatted with a monospace font
 */
const CodeText: React.FunctionComponent<TExternalProps> = ({ style, ...props }) => (
  <Text style={[styles.codeText, style]} {...props} />
);

const styles = StyleSheet.create({
  codeText: {
    ...typographyStyles.code,
    color: black,
  },
});

export { CodeText };
