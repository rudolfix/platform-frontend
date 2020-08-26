import { TMessage } from "../../components/translatedMessages/utils";
import { TFormData, TFormDataCommon, TFormFieldData } from "./types";

const resetCurrentFieldValidation = (field: TFormDataCommon) => {
  field.errors = [];
  field.isValid = false;
};

const runValidationsOnField = <F extends object, V extends TFormDataCommon>(form: F, field: V) => {
  field.validations.forEach(validation => {
    const validationError = validation(form, field);
    if (validationError !== null) {
      field.errors.push(validationError);
    }
  });
};

const validateChildren = <K, V>(form: TFormData<K, V>, currentField: TFormData<K, V>) => {
  if (isForm(currentField)) {
    const fields = currentField.fields;
    Object.keys(fields).forEach(key => {
      fields[key as keyof K] = validateForm(form, fields[key as keyof K]);
    });

    return Object.keys(currentField.fields).reduce(
      (currentFieldIsValid, key) => currentFieldIsValid && fields[key as keyof K].isValid,
      true,
    );
  } else {
    return currentField;
  }
};

export const validateForm = <
  F extends TFormData<unknown, unknown>,
  V extends TFormData<unknown, unknown> | TFormFieldData<unknown>
>(
  form: F,
  currentField: V,
) => {
  if (isForm(currentField)) {
    resetCurrentFieldValidation(currentField);

    const childFieldsAreValid = validateChildren(form, currentField);
    runValidationsOnField(form, currentField);

    currentField.isValid = currentField.errors.length === 0 && childFieldsAreValid;

    return currentField;
  } else if (isFormField(currentField)) {
    resetCurrentFieldValidation(currentField);

    runValidationsOnField(form, currentField);
    currentField.isValid = currentField.errors.length === 0;

    return currentField;
  } else {
    return currentField;
  }
};

export const minStringLengthValidation = <F extends object, V extends { value: string }>(
  minLength: number,
  errorMessage: string,
) => (_form: F, field: V) => {
  if (isFormField(field) && field.value.trim().length < minLength) {
    return errorMessage;
  } else {
    return null;
  }
};

export const maxStringLenghValidation = <F extends object, V extends { value: string }>(
  maxLength: number,
  errorMessage: string,
) => (_form: F, field: V) => {
  if (isFormField(field) && field.value.trim().length > maxLength) {
    return errorMessage;
  } else {
    return null;
  }
};

const isFormField = <T>(x: any): x is TFormFieldData<T> => x.value !== undefined;

const isForm = <T, V>(x: any): x is TFormData<T, V> => x.fields !== undefined;

const hasPath = <T, V>(x: TFormData<T, V>, pathSegment: string) =>
  x.fields[pathSegment as keyof T] !== undefined;

export const setFormValue = <T, V>(
  form: TFormData<T, V>,
  fieldPath: string,
  value: V,
): TFormData<T, V> => {
  const pathAsArray = fieldPath.split(".").splice(1); // the first segment of path (formId) is not used for now
  return setValue(form, pathAsArray, value) as TFormData<T, V>;
};

export const setValue = <T, V>(
  form: TFormData<T, V> | TFormFieldData<V>,
  fieldPath: string[],
  value: V,
): TFormData<T, V> | TFormFieldData<V> => {
  const [pathSegment, ...rest] = fieldPath;
  if (isFormField(form) && rest.length === 0) {
    return {
      ...form,
      value,
    };
  } else if (isForm(form) && isFormField(form.fields[pathSegment as keyof T])) {
    return {
      ...form,
      fields: {
        ...form.fields,
        [pathSegment as keyof T]: setValue(
          form.fields[pathSegment as keyof T] as TFormFieldData<V>,
          rest,
          value,
        ) as TFormFieldData<V>,
      },
    };
  } else {
    return form;
  }
};

export const setError = <T, V>(
  form: TFormData<T, V> | TFormFieldData<V>,
  fieldPath: string[],
  error: TMessage,
) => {
  const [pathSegment, ...rest] = fieldPath;
  if (isForm(form) && hasPath(form, pathSegment) && rest.length === 0) {
    (form as TFormDataCommon).errors.push(error);
  } else if (isForm(form) && hasPath(form, pathSegment)) {
    const next = form.fields[pathSegment as keyof T];
    setError(next, rest, error);
  }
  return form;
};
