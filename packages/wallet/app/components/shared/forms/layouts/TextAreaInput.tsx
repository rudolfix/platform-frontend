import * as React from "react";
import { StyleSheet } from "react-native";

import { TextInput } from "./TextInput";

type TNativeTextInputProps = React.ComponentProps<typeof TextInput>;
type TExternalProps = Omit<TNativeTextInputProps, "multiline" | "numberOfLines">;

/**
 * A text area component that aligns with our design system
 * @note It's wrapper around TextInput to provide consistent look for multiline text inputs
 */
const TextAreaInput: React.FunctionComponent<TExternalProps> = ({ style, ...props }) => (
  <TextInput style={[styles.textAreaInput, style]} multiline={true} {...props} />
);

const styles = StyleSheet.create({
  textAreaInput: {
    minHeight: 120,
  },
});

export { TextAreaInput };
