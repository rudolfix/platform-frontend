import { assertNever } from "@neufund/shared-utils";
import { Ref } from "react";
import * as React from "react";
import { StyleProp, StyleSheet, View, ViewStyle } from "react-native";
import { TComponentRefType } from "../../../../utils/types";
import { ErrorMessage } from "./ErrorMessage";
import { HelperText } from "./HelperText";
import { Label } from "./Label";
import { SelectList } from "./select-list/SelectList";
import { TextAreaInput } from "./TextAreaInput";
import { TextInput } from "./TextInput";

enum EFieldType {
  INPUT = "input",
  TEXT_AREA = "text-area",
  SELECT_LIST = "select-list",
}

type TInputProps =
  | ({ type: EFieldType.INPUT } & React.ComponentPropsWithRef<typeof TextInput>)
  | ({ type: EFieldType.TEXT_AREA } & React.ComponentPropsWithRef<typeof TextAreaInput>)
  | ({ type: EFieldType.SELECT_LIST } & React.ComponentPropsWithRef<typeof SelectList>);

type TExternalProps = {
  label?: string;
  style?: StyleProp<ViewStyle>;
  helperText?: string;
  errorMessage?: string;
  inputRef?: Ref<TComponentRefType<typeof TextInput>> | Ref<TComponentRefType<typeof SelectList>>;
} & TInputProps;

const getInput = (props: TInputProps) => {
  switch (props.type) {
    case EFieldType.INPUT:
      return <TextInput {...props} />;
    case EFieldType.TEXT_AREA:
      return <TextAreaInput {...props} />;
    case EFieldType.SELECT_LIST:
      return <SelectList {...props} />;
    default:
      assertNever(props, "Invalid input type");
  }
};

/**
 * A wrapper around label, input/select, help text and error message to just provide single top level api to be used in components
 */
const FieldLayout: React.FunctionComponent<TExternalProps> = ({
  style,
  label,
  errorMessage,
  helperText,
  inputRef,
  ...inputProps
}) => {
  const invalid = !!errorMessage;

  return (
    <View style={[styles.field, style]}>
      {label && <Label>{label}</Label>}
      {getInput({ invalid, ref: inputRef, ...inputProps })}
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

export { FieldLayout, EFieldType };
