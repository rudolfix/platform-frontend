import { assertNever } from "@neufund/shared";
import { useField } from "formik";
import React, { Ref } from "react";
import { StyleProp, ViewStyle } from "react-native";

import { TComponentRefType } from "../../../../utils/types";
import { EFieldType, FieldLayout } from "../layouts/FieldLayout";
import { SelectList } from "../layouts/select-list/SelectList";
import { TextInput } from "../layouts/TextInput";

type TCustomInputProps =
  | ({ type: EFieldType.INPUT } & {})
  | ({ type: EFieldType.TEXT_AREA } & {})
  | ({ type: EFieldType.SELECT_LIST } & Pick<React.ComponentProps<typeof SelectList>, "items">);

type TExternalProps = {
  name: string;
  label?: string;
  style?: StyleProp<ViewStyle>;
  helperText?: string;
  inputRef?: Ref<TComponentRefType<typeof TextInput>> | Ref<TComponentRefType<typeof SelectList>>;
} & TCustomInputProps;

/**
 * A formik wrapper around `FieldLayout` component
 */
const Field: React.FunctionComponent<TExternalProps> = props => {
  const [field, meta] = useField(props);

  switch (props.type) {
    case EFieldType.INPUT:
    case EFieldType.TEXT_AREA:
      return (
        <FieldLayout
          onChangeText={field.onChange(props.name)}
          onBlur={field.onBlur(props.name)}
          value={field.value}
          errorMessage={(meta.touched && meta.error) || undefined}
          {...props}
        />
      );

    case EFieldType.SELECT_LIST:
      return (
        <FieldLayout
          onChangeItem={field.onChange(props.name)}
          selectedItemId={field.value}
          errorMessage={(meta.touched && meta.error) || undefined}
          {...props}
        />
      );

    default:
      assertNever(props);
  }
};

export { Field };
