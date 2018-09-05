import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikProps, getIn } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps } from "../../../../types";
import { computedValue, countedCharacters, IFieldGroup } from "./FormFieldRaw";
import { FormLabel } from "./FormLabel";
import { isNonValid, isValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

type FieldGroupProps = IFieldGroup & FieldAttributes & CommonHtmlProps;

export class FormField extends React.Component<FieldGroupProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactChild {
    const {
      label,
      type,
      placeholder,
      name,
      prefix,
      suffix,
      className,
      addonStyle,
      charactersLimit,
      ...props
    } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const { touched, errors } = formik;

    //This is done due to the difference between reactstrap and @typings/reactstrap
    const inputExtraProps = {
      invalid: isNonValid(touched, errors, name),
    } as any;
    return (
      <FormGroup>
        {label && <FormLabel>{label}</FormLabel>}
        <Field
          name={name}
          render={({ field }: FieldProps) => {
            const val = computedValue(field.value, charactersLimit);
            return (
              <>
                <InputGroup>
                  {prefix && (
                    <InputGroupAddon addonType="prepend" className={cn(styles.addon, addonStyle)}>
                      {prefix}
                    </InputGroupAddon>
                  )}
                  <Input
                    className={cn(className, styles.inputField)}
                    {...field}
                    type={type}
                    value={val}
                    valid={isValid(touched, errors, name)}
                    placeholder={placeholder}
                    {...inputExtraProps}
                    {...props}
                  />
                  {suffix && (
                    <InputGroupAddon addonType="append" className={styles.addon}>
                      {suffix}
                    </InputGroupAddon>
                  )}
                </InputGroup>
                {isNonValid(touched, errors, name) && (
                  <div className={styles.errorLabel}>{getIn(errors, name) || props.errorMsg}</div>
                )}
                {charactersLimit && <div>{countedCharacters(val, charactersLimit)}</div>}
              </>
            );
          }}
        />
      </FormGroup>
    );
  }
}
