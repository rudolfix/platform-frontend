import { Field, FieldAttributes, FieldProps, FormikConsumer } from "formik";
import { map, mapValues } from "lodash";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { FormGroup, Input } from "reactstrap";

import { FormLabel } from "./FormLabel";
import { isNonValid, isValid } from "./utils";

import * as styles from "./FormStyles.module.scss";

export const NONE_KEY = "";
export const BOOL_TRUE_KEY = "true";
export const BOOL_FALSE_KEY = "false";

export const boolify = <T extends {}>(values: T): T => {
  if (!values) return values;

  return mapValues(values, key => {
    if (key === BOOL_TRUE_KEY) return true;
    if (key === BOOL_FALSE_KEY) return false;
    return key;
  }) as T;
};

export const unboolify = <T extends {}>(values: T): T => {
  if (!values) return values;

  return mapValues(values, key => {
    if (key === true) return BOOL_TRUE_KEY;
    if (key === false) return BOOL_FALSE_KEY;
    return key;
  }) as T;
};

interface IOwnProps {
  isOptional?: boolean;
  optionalLabel?: FormattedMessage;
  extraMessage?: string | React.ReactNode;
  "data-test-id"?: string;
}

interface IFieldGroup {
  label?: string | React.ReactNode;
  values?: {
    [key: string]: string | React.ReactNode;
  };
  customOptions?: React.ReactNode[];
  disabledValues?: {
    [key: string]: boolean;
  };
}

type FieldGroupProps = IFieldGroup & FieldAttributes<any>;

export class FormSelectField extends React.Component<FieldGroupProps & IOwnProps> {
  renderOptions = (isOptional: boolean, optionalLabel: string | FormattedMessage) => {
    const mainOptions = this.props.customOptions
      ? this.props.customOptions
      : map(this.props.values, (value, key) => (
          <option
            key={key}
            value={key}
            disabled={this.props.disabledValues && this.props.disabledValues[key]}
          >
            {value}
          </option>
        ));
    if (isOptional) {
      return [
        <option key={"not_set"} value={"not_set"}>
          {optionalLabel}
        </option>,
      ].concat(mainOptions);
    } else {
      return mainOptions;
    }
  };

  render(): React.ReactNode {
    const {
      label,
      name,
      extraMessage,
      "data-test-id": dataTestId,
      disabled,
      isOptional,
      optionalLabel,
    } = this.props;

    return (
      <FormikConsumer>
        {({ touched, errors, setFieldTouched, setFieldValue }) => {
          //This is done due to the difference between reactstrap and @typings/reactstrap
          const inputExtraProps = {
            invalid: isNonValid(touched, errors, name),
          } as any;

          const setOrUnsetValue = (value: any) => {
            if (value === "not_set") {
              //TODO make an enum
              setFieldValue(name, undefined, false);
            } else {
              setFieldValue(name, value, true);
            }
          };

          return (
            <FormGroup>
              {label && <FormLabel name={name}>{label}</FormLabel>}
              <div className={styles.customSelect}>
                <Field
                  name={name}
                  render={({ field }: FieldProps) => {
                    field.onChange = e => setOrUnsetValue(e.target.value);
                    return (
                      <Input
                        {...field}
                        disabled={disabled}
                        onFocus={() => setFieldTouched(name, true)}
                        type="select"
                        //if value is not set, select the placeholder
                        value={field.value === undefined ? "not_set" : field.value}
                        valid={isValid(touched, errors, name)}
                        data-test-id={dataTestId}
                        {...inputExtraProps}
                      >
                        {this.renderOptions(isOptional, optionalLabel)}
                      </Input>
                    );
                  }}
                />
              </div>
              {extraMessage ? (
                <div className={styles.noteLabel}>{extraMessage}</div>
              ) : (
                <>
                  {isNonValid(touched, errors, name) && (
                    <div className={styles.errorLabel}>{errors[name]}</div>
                  )}
                </>
              )}
            </FormGroup>
          );
        }}
      </FormikConsumer>
    );
  }
}
