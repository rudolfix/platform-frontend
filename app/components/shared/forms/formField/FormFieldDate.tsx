import { Field } from "formik";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";
import * as styles from "./FormFieldDate.module.scss";

interface IProps {
  label: string;
  name: string;
}

const positionMap = {
  year: 0,
  month: 1,
  day: 2,
};

export class FormFieldDate extends React.Component<IProps> {
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
    return (
      <FormGroup className={styles.birthDateField}>
        <span className={styles.label}>{this.props.label}</span>
        <div className={styles.inputsWrapper}>
          <Field
            name={this.props.name}
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  onChange={e => this.onChange("day", e, field.onChange)}
                  value={this.fromValue("day", field.value)}
                  type="tel"
                  placeholder="dd"
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
                  placeholder="mm"
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
                  onChange={e => this.onChange("year", e, field.onChange)}
                  value={this.fromValue("year", field.value)}
                  type="tel"
                  placeholder="yyyy"
                />
              </div>
            )}
          />
        </div>
      </FormGroup>
    );
  }
}
