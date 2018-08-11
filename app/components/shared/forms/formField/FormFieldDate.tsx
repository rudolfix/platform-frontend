import { Field, FormikErrors, FormikProps, FormikTouched } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";
import { TTranslatedString } from "../../../../types";

import * as styles from "./FormFieldDate.module.scss";
import * as errorStyles from "./FormStyles.module.scss";

interface IProps {
  label: TTranslatedString;
  name: string;
  "data-test-id"?: string;
}

const positionMap = {
  year: 0,
  month: 1,
  day: 2,
};

const isValid = (
  touched: FormikTouched<any>,
  errors: FormikErrors<any>,
  name: string,
): boolean | undefined => {
  if (touched && touched[name] !== true) {
    return undefined;
  }

  return !(errors && errors[name]);
};

export class FormFieldDate extends React.Component<IProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  cache = {
    day: "",
    month: "",
    year: "",
  };

  monthInput?: HTMLInputElement;
  saveMonthRef = (ref: HTMLInputElement) => {
    this.monthInput = ref;
  };
  yearInput?: HTMLInputElement;
  saveYearRef = (ref: HTMLInputElement) => {
    this.yearInput = ref;
  };

  onChange = (
    type: "year" | "month" | "day",
    e: React.FormEvent<HTMLInputElement>,
    handler: (e: React.FormEvent<HTMLInputElement>) => void,
  ) => {
    this.cache[type] = e.currentTarget.value;
    e.currentTarget.value = `${this.cache.year}-${this.cache.month}-${this.cache.day}`;

    handler(e);
  };

  fromValue = (type: "year" | "month" | "day", value: string = ""): string => {
    const items = value.split("-");
    this.cache[type] = items.length === 3 ? items[positionMap[type]] : "";
    return this.cache[type];
  };

  render(): React.ReactNode {
    const formik: FormikProps<any> = this.context.formik;
    const { touched, errors } = formik;
    const { name, "data-test-id": dataTestId } = this.props;
    const valid = isValid(touched, errors, name);
    return (
      <FormGroup>
        <div className={styles.dateField} data-test-id={dataTestId}>
          <span className={styles.label}>{this.props.label}</span>
          <div className={styles.inputsWrapper}>
            <Field
              name={this.props.name}
              render={({ field }) => (
                <div className={styles.inputWrapper}>
                  <Input
                    {...field}
                    onChange={e => {
                      this.onChange("day", e, field.onChange);
                      // auto advance to next field
                      const realValue = this.fromValue("day", e.target.value);
                      if (realValue.length === 2) {
                        this.monthInput!.focus();
                      }
                    }}
                    value={this.fromValue("day", field.value)}
                    placeholder="DD"
                    valid={valid}
                    maxLength={2}
                    data-test-id="form-field-date-day"
                  />
                </div>
              )}
            />
            {"/"}
            <Field
              name={this.props.name}
              render={({ field }) => (
                <div>
                  <Input
                    {...field}
                    onChange={e => {
                      this.onChange("month", e, field.onChange);
                      // auto advance to next field
                      const realValue = this.fromValue("month", e.target.value);
                      if (realValue.length === 2) {
                        this.yearInput!.focus();
                      }
                    }}
                    value={this.fromValue("month", field.value)}
                    placeholder="MM"
                    valid={valid}
                    maxLength={2}
                    data-test-id="form-field-date-month"
                    innerRef={this.saveMonthRef}
                  />
                </div>
              )}
            />
            {"/"}
            <Field
              name={this.props.name}
              render={({ field }) => (
                <div className={styles.dateFieldYear}>
                  <Input
                    {...field}
                    onChange={e => this.onChange("year", e, field.onChange)}
                    value={this.fromValue("year", field.value)}
                    placeholder="YYYY"
                    valid={valid}
                    maxLength={4}
                    data-test-id="form-field-date-year"
                    innerRef={this.saveYearRef}
                  />
                </div>
              )}
            />
          </div>
        </div>
        <div className={styles.errorLabel}>
          {errors[name] &&
            touched[name] && <div className={errorStyles.errorLabel}>{errors[name]}</div>}
        </div>
      </FormGroup>
    );
  }
}
