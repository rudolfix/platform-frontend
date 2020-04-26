import { useFieldMeta } from "@neufund/design-system";
import * as cn from "classnames";
import { FastField, FieldProps, FieldValidator } from "formik";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps } from "../../../../types";
import { convertToPrecision } from "../../../eto/utils";
import { generateErrorId } from "../layouts/FormError";
import { FormFieldError } from "./FormFieldError";
import { FormFieldLabel } from "./FormFieldLabel";

import * as styles from "./FormStyles.module.scss";

interface IFieldGroup {
  name: string;
  disabled?: boolean;
  label?: string | React.ReactNode;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  addonStyle?: string;
  maxLength?: number;
  min?: number | string;
  ratio?: number;
  customValidation?: FieldValidator;
  customOnBlur?: Function;
}

type FieldGroupProps = IFieldGroup & CommonHtmlProps;

// TODO: Wrap with `withFormField`
export const NumberTransformingField = ({
  label,
  placeholder,
  name,
  prefix,
  suffix,
  className,
  addonStyle,
  disabled,
  customValidation,
  customOnBlur,
  maxLength,
  min,
}: FieldGroupProps) => {
  const { invalid, changeValue } = useFieldMeta(name);

  return (
    <FormGroup>
      {label && <FormFieldLabel name={name}>{label}</FormFieldLabel>}
      <FastField name={name} validate={customValidation}>
        {({ field, form }: FieldProps) => (
          <InputGroup>
            {prefix && (
              <InputGroupAddon addonType="prepend" className={cn(styles.addon, addonStyle)}>
                {prefix}
              </InputGroupAddon>
            )}
            <Input
              {...field}
              type="number"
              aria-describedby={generateErrorId(name)}
              aria-invalid={invalid}
              invalid={invalid}
              className={cn(className, styles.inputField)}
              onBlur={e => {
                if (customOnBlur) {
                  customOnBlur(e);
                }
                form.setFieldValue(name, convertToPrecision(2)(e.target.valueAsNumber));
              }}
              onChange={e => {
                changeValue(e.target.value === "" ? undefined : e.target.value);
              }}
              value={field.value !== undefined ? field.value : ""}
              placeholder={placeholder}
              disabled={disabled}
              maxLength={maxLength}
              min={min}
            />
            {suffix && (
              <InputGroupAddon addonType="append" className={styles.addon}>
                {suffix}
              </InputGroupAddon>
            )}
          </InputGroup>
        )}
      </FastField>
      <FormFieldError name={name} />
    </FormGroup>
  );
};
