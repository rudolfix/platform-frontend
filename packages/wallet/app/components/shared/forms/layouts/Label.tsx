import * as React from "react";
import { StyleSheet, Text } from "react-native";
import { baseGray } from "../../../../styles/colors";
import { typographyStyles } from "../../../../styles/typography";

type TExternalProps = React.ComponentProps<typeof Text>;

/**
 * An label component that aligns with our design system
 */
const Label: React.FunctionComponent<TExternalProps> = ({ style, ...props }) => (
  <Text style={[styles.label, style]} {...props} />
);

const styles = StyleSheet.create({
  label: {
    ...typographyStyles.label,
    color: baseGray,
  },
});

export { Label };
