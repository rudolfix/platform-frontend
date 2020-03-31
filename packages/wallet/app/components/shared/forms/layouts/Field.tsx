import { assertNever } from "@neufund/shared";
import * as React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { ErrorMessage } from "./ErrorMessage";
import { HelperText } from "./HelperText";
import { Label } from "./Label";
import { TextAreaInput } from "./TextAreaInput";
import { TextInput } from "./TextInput";

enum EFieldType {
  INPUT = "input",
  TEXT_AREA = "text-area",
}

type TInputProps =
  | ({ type: EFieldType.INPUT } & React.ComponentProps<typeof TextInput>)
  | ({ type: EFieldType.TEXT_AREA } & React.ComponentProps<typeof TextAreaInput>);

type TExternalProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
  helperText?: string;
  errorMessage?: string;
} & TInputProps;

const getInput = ({ type, ...rest }: TInputProps) => {
  switch (type) {
    case EFieldType.INPUT:
      return <TextInput {...rest} />;
    case EFieldType.TEXT_AREA:
      return <TextAreaInput {...rest} />;
    default:
      assertNever(type, "Invalid input type");
  }
};

/**
 * A wrapper around label, input, help text and error message to just provide single top level api to be used in components
 */
const Field: React.FunctionComponent<TExternalProps> = ({
  style,
  label,
  errorMessage,
  helperText,
  ...inputProps
}) => {
  const invalid = !!errorMessage;

  return (
    <View style={[styles.field, style]}>
      {label && <Label>{label}</Label>}
      {getInput({ invalid, ...inputProps })}
      {errorMessage && <ErrorMessage style={styles.helperText}>{errorMessage}</ErrorMessage>}
      {helperText && !errorMessage && (
        <HelperText style={styles.helperText}>{helperText}</HelperText>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  field: {
    marginBottom: 10,
  },
  helperText: {
    marginTop: 4,
  },
});

export { Field, EFieldType };
