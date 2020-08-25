import { ReactElement } from "react";
import { FormattedMessage } from "react-intl-phraseapp";

// we dont use AllHtmlAttributes because they include many more fields which can collide easily with components props (like data)
export type CommonHtmlProps = {
  className?: string;
};

export type TTranslatedString = string | ReactElement<FormattedMessage.Props>;

export type TFormDataCommon = {
  errors: TTranslatedString[],
  isValid: boolean,
  disabled: boolean,
  validations: Function[]
}

export   type TFormFieldData<T> = {
  value: T,
}  & TFormDataCommon

export  type TFormData<T,V> = {
  fields: { [K in keyof T ]: TFormFieldData<V> }
} & TFormDataCommon
