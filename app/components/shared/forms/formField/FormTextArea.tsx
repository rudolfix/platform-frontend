import { Field, FieldAttributes, FieldProps, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, InputGroup, InputGroupAddon } from "reactstrap";
import { FormLabel } from "./FormLabel";

import { CommonHtmlProps, TTranslatedString } from "../../../../types";
import { isNonValid } from "./utils";

interface IFieldGroup {
  label?: TTranslatedString;
  placeholder?: string;
  prefix?: string;
  suffix?: string;
  className?: string;
  charactersLimit?: number;
}
type FieldGroupProps = IFieldGroup & FieldAttributes & CommonHtmlProps;
export class FormTextArea extends React.Component<FieldGroupProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactChild {
    const { label, placeholder, name, prefix, suffix, className, charactersLimit } = this.props;
    const formik: FormikProps<any> = this.context.formik;
    const { touched, errors } = formik;

    const computedValue = (value: string | undefined, limit: number | undefined): string => {
      if (!value) {
        return "";
      }

      if (!limit) {
        return value;
      }

      return value.length > limit ? value.slice(0, charactersLimit) : value;
    };

    const countedCharacters = (value: string | undefined, limit: number | undefined): string => {
      return `${computedValue(value, limit).length}/${limit}`;
    };

    return (
      <FormGroup>
        {label && <FormLabel>{label}</FormLabel>}
        <Field
          name={name}
          render={({ field }: FieldProps) => {
            const { value } = field;

            return (
              <>
                <InputGroup>
                  {prefix && (
                    <InputGroupAddon addonType="prepend" className={className}>
                      {prefix}
                    </InputGroupAddon>
                  )}
                  <textarea
                    {...field}
                    value={computedValue(value, charactersLimit)}
                    placeholder={placeholder}
                    className={className}
                  />
                  {suffix && <InputGroupAddon addonType="append">{suffix}</InputGroupAddon>}
                </InputGroup>
                <div className="mt-2">
                  {isNonValid(touched, errors, name) && <div>{errors[name]}</div>}
                  {charactersLimit && <div>{countedCharacters(value, charactersLimit)}</div>}
                </div>
              </>
            );
          }}
        />
      </FormGroup>
    );
  }
}
