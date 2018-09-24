import { FormikErrors, FormikTouched } from "formik";
import { get } from "lodash";

/* The function that encapsulates the logic of determining a value for Input field valid property. Note we have to
   return boolean | undefined value. Undefined should be returned when the field has not been touched by the user. */
// TODO: Refactor to formik 'ErrorMessage' component
export const isValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  key: string,
): boolean | undefined => {
  if (touched && get(touched, key) !== true) {
    return undefined;
  }

  return !(errors && get(errors, key));
};

export const isNonValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  name: string,
): boolean | undefined => {
  const valid = isValid(touched, errors, name);
  if (valid === undefined || valid === true) return false;
  else return true;
};
