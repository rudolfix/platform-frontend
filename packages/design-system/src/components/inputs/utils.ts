import { useField, useFormikContext } from "formik";
import { FieldMetaProps } from "formik/dist/types";
import * as React from "react";
import { InputProps } from "reactstrap";

/**
 *  The function that encapsulates the logic of determining a value for field valid property.
 */
export const isValid = (
  touched: boolean,
  error: string | undefined,
  submitCount: number,
  ignoreTouched?: boolean,
): boolean => (ignoreTouched || touched || submitCount > 0 ? !error : true);

export const applyCharactersLimit = (val: InputProps["value"] = "", limit: number | undefined) => {
  if (typeof val === "number" || Array.isArray(val) || !limit) {
    return val;
  }

  return limit && val.length > limit ? val.slice(0, limit) : val;
};

type TUseFieldMetaOptions = {
  ignoreTouched: boolean;
};

type TUseFieldMeta<Val> = FieldMetaProps<Val> & {
  invalid: boolean;
  valid: boolean;
  changeValue: (value: Val) => void;
};

/**
 * Custom meta information related to the formik field.
 *
 * @param fieldName - Field name provided to formik
 * @param options - Custom options
 * @param options.ignoreTouched - Mark field as invalid even when it was not touched yet
 *
 * @returns All formik provided meta information's and some custom one.
 *          - invalid, valid - marks whether field is valid or invalid
 *                             (takes into account whether it's touched or no and submit count)
 *          - changeValue - touches then field and then changes it's value
 */
// tslint:disable-next-line:no-any-on-steroid
export const useFieldMeta = <Val extends any = any>(
  fieldName: string,
  options: TUseFieldMetaOptions = {
    ignoreTouched: false,
  },
): TUseFieldMeta<Val> => {
  const [, meta] = useField<Val>(fieldName);
  const { submitCount, setFieldValue, setFieldTouched } = useFormikContext<Val>();

  const valid = isValid(meta.touched, meta.error, submitCount, options.ignoreTouched);

  const changeValue = React.useCallback(
    (value: Val) => {
      // do not run validation twice here, just only when changing the value
      // also it's important to do touch field before changing the value
      // as otherwise validation gonna be called with previous value
      setFieldTouched(fieldName, true, false);
      setFieldValue(fieldName, value);
    },
    [fieldName],
  );

  return {
    ...meta,
    valid,
    invalid: !valid,
    changeValue,
  };
};
