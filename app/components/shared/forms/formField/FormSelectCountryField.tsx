
import * as React from "react";
import {FormSelectField} from './FormSelectField'
import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";

const VALUES = {
  "de": "Germany"
}

interface IFieldGroup {
  label?: string;
}

type FieldGroupProps = IFieldGroup & FieldAttributes;


export const FormSelectCountryField: React.SFC<FieldGroupProps>  = props => 
  <FormSelectField {...props} values={VALUES} />