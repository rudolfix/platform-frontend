import { Field, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";

import * as styles from "./FormFieldDate.module.scss";
import * as errorStyles from "./FormStyles.module.scss";

interface IProps {
  label: string;
  name: string;
}

const positionMap = {
  year: 0,
  month: 1,
  day: 2,
};

const isValid = (
  touched: { [name: string]: boolean },
  errors: { [name: string]: string },
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
    const { name } = this.props;
    const valid = isValid(touched, errors, name);
    return (
      <FormGroup>
        <div className={styles.dateField}>
          <span className={styles.label}>{this.props.label}</span>
          <div className={styles.inputsWrapper}>
            <Field
              name={this.props.name}
              render={({ field }) => (
                <div className={styles.inputWrapper}>
                  <Input
                    {...field}
                    onChange={e => this.onChange("day", e, field.onChange)}
                    value={this.fromValue("day", field.value)}
                    type="tel"
                    placeholder="DD"
                    valid={valid}
                    maxLength={2}
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
                    onChange={e => this.onChange("month", e, field.onChange)}
                    value={this.fromValue("month", field.value)}
                    type="tel"
                    placeholder="MM"
                    valid={valid}
                    maxLength={2}
                  />
                </div>
              )}
            />
            {"/"}
            {/* TODO: Add to translations file */}
            <Field
              name={this.props.name}
              render={({ field }) => (
                <div className={styles.dateFieldYear}>
                  <Input
                    {...field}
                    onChange={e => this.onChange("year", e, field.onChange)}
                    value={this.fromValue("year", field.value)}
                    type="tel"
                    placeholder="YYYY"
                    valid={valid}
                    maxLength={4}
                  />
                </div>
              )}
            />
          </div>
        </div>
        {errors[name] &&
          touched[name] && <div className={errorStyles.errorLabel}>{errors[name]}</div>}
      </FormGroup>
    );
  }
}
