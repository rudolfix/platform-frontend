import * as cn from "classnames";
import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Input, InputGroup, InputGroupAddon } from "reactstrap";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { Avatar } from "../../Avatar";
import { CustomTooltip } from "../../CustomTooltip";
import { FormLabel } from "./FormLabel";
import { isNonValid, isValid } from "./utils";

import * as icon from "../../../../assets/img/notifications/warning.svg";
import * as styles from "./FormFieldImportant.module.scss";
import * as formStyles from "./FormStyles.module.scss";

type InputType =
  | "text"
  | "email"
  | "date"
  | "datetime-local"
  | "month"
  | "number"
  | "search"
  | "tel"
  | "url"
  | "password"
  | "datetime"
  | "time";

interface IFieldGroup {
  label?: TTranslatedString;
  placeholder?: string;
  errorMessage?: string | React.ReactNode;
  type?: InputType;
  hasAvatar?: boolean;
}
type FieldGroupProps = IFieldGroup & FieldAttributes & CommonHtmlProps;

export class FormFieldImportant extends React.Component<FieldGroupProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactChild {
    const {
      type,
      placeholder,
      name,
      className,
      errorMessage,
      validate,
      label,
      hasAvatar,
      ...props
    } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const { errors } = formik;
    const tooltipId = `${name}_error_notification`;

    return (
      <>
        {label && <FormLabel>{label}</FormLabel>}
        <Field
          name={name}
          validate={validate}
          render={({ field }: FieldProps) => (
            <>
              <InputGroup className={styles.inputGroup}>
                <Input
                  className={cn(className, formStyles.inputField, styles.input)}
                  {...field}
                  type={type}
                  value={field.value || ""}
                  placeholder={placeholder || ""}
                  {...props as any}
                />
                <InputGroupAddon addonType="append" className={formStyles.addon}>
                  {!!errors[name] && (
                    <>
                      <img id={tooltipId} src={icon} />
                      <CustomTooltip target={tooltipId}>{errorMessage}</CustomTooltip>
                    </>
                  )}
                </InputGroupAddon>
              </InputGroup>
              {hasAvatar && (
                <Avatar
                  seed={field.value || ""}
                  style={{ position: "absolute", right: "36px", top: "-40px" }}
                />
              )}
            </>
          )}
        />
      </>
    );
  }
}
