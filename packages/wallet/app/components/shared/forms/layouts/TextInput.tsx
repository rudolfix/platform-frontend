import * as React from "react";
import {
  NativeSyntheticEvent,
  StyleSheet,
  TextInput as NativeTextInput,
  TextInputFocusEventData,
} from "react-native";

import {
  baseGray,
  baseRed,
  baseWhite,
  blueyGrey,
  grayLighter4,
  silverLighter1,
} from "../../../../styles/colors";
import { roundness } from "../../../../styles/common";
import { typographyStyles } from "../../../../styles/typography";
import { st } from "../../../utils";

type TNativeTextInputProps = Omit<React.ComponentProps<typeof NativeTextInput>, "editable">;
type TExternalProps = { disabled?: boolean; invalid?: boolean } & TNativeTextInputProps;

/**
 * A text input component that aligns with our design system
 */
const TextInput = React.forwardRef<NativeTextInput, TExternalProps>(
  ({ style, onFocus, onBlur, disabled, invalid, ...props }, ref) => {
    const [hasFocus, setHasFocus] = React.useState(false);

    const handleFocus = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setHasFocus(true);

      onFocus?.(event);
    };

    const handleBlur = (event: NativeSyntheticEvent<TextInputFocusEventData>) => {
      setHasFocus(false);

      onBlur?.(event);
    };

    return (
      <NativeTextInput
        ref={ref}
        editable={!disabled}
        placeholderTextColor={blueyGrey}
        style={st(
          styles.input,
          [hasFocus, styles.inputFocused],
          [disabled, styles.inputDisabled],
          [invalid, styles.inputInvalid],
          style,
        )}
        onBlur={handleBlur}
        onFocus={handleFocus}
        {...props}
      />
    );
  },
);

const styles = StyleSheet.create({
  input: {
    ...typographyStyles.body,
    // there is a bug in RN where `lineHeight` to not enforce height changes
    lineHeight: 20,
    backgroundColor: baseWhite,
    borderColor: grayLighter4,
    borderRadius: roundness,
    borderStyle: "solid",
    borderWidth: 1,
    color: baseGray,
    // `paddingVertical` do not work properly in multiline mode
    paddingTop: 14,
    paddingBottom: 14,
    paddingHorizontal: 16,
  },
  inputFocused: {
    borderColor: baseGray,
  },
  inputDisabled: {
    backgroundColor: silverLighter1,
    color: blueyGrey,
  },
  inputInvalid: {
    borderColor: baseRed,
  },
});

export { TextInput };
