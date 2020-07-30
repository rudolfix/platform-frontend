import { useFieldMeta } from "@neufund/design-system";
import cn from "classnames";
import { Field, FieldProps } from "formik";
import * as React from "react";
import { FormGroup, Input, InputProps } from "reactstrap";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { Avatar } from "../../Avatar";
import { generateErrorId } from "../layouts/FormError";
import { FormFieldError } from "./FormFieldError";
import { FormFieldLabel } from "./FormFieldLabel";

import * as styles from "./FormFieldColorful.module.scss";

interface IFieldGroup {
  name: string;
  label?: string;
  placeholder?: string;
  maxLength?: string;
  showAvatar?: boolean;
  errorMessage?: TTranslatedString;
}

type FieldGroupProps = IFieldGroup & InputProps & CommonHtmlProps;

// TODO: Wrap `withFormField`
const FormFieldColorful: React.FunctionComponent<FieldGroupProps> = ({
  label,
  type,
  placeholder,
  name,
  className,
  showAvatar,
  ...props
}) => {
  const { invalid, valid } = useFieldMeta(name);

  return (
    <FormGroup>
      {label && <FormFieldLabel name={name}>{label}</FormFieldLabel>}

      <Field name={name}>
        {({ field }: FieldProps) => (
          <>
            <div className={cn(styles.inputWrapper, { "is-invalid": invalid, "is-valid": valid })}>
              <Input
                {...field}
                aria-describedby={generateErrorId(name)}
                aria-invalid={invalid}
                invalid={invalid}
                className={cn(styles.input, className)}
                type={type}
                value={field.value}
                placeholder={placeholder || label}
                {...props}
              />
              {showAvatar && (
                <div className={styles.addon}>
                  <Avatar seed={field.value || ""} />
                </div>
              )}
            </div>
            <FormFieldError name={name} />
          </>
        )}
      </Field>
    </FormGroup>
  );
};

export { FormFieldColorful };
