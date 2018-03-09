
import * as React from "react";
import {FormSelectField, NONE_KEY} from './FormSelectField'
import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";

const VALUES = {
  NONE_KEY: "-Please select-",
  "de": "Germany"
}

interface IFieldGroup {
  label?: string;
}

type FieldGroupProps = IFieldGroup & FieldAttributes;


export const FormSelectCountryField: React.SFC<FieldGroupProps>  = props => 
  <FormSelectField {...props} values={VALUES} />