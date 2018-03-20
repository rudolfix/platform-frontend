import { Field } from "formik";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";
import * as styles from "./FormFieldBirthDate.module.scss";

export class FormFieldBirthDate extends React.Component {
  state = {
    birthYear: null,
    birthMonth: null,
    birthDay: null,
  };

  render(): React.ReactNode {
    return (
      <FormGroup className={styles.birthDateField}>
        <span className={styles.label}>Birth date</span>
        <div className={styles.inputsWrapper}>
          <Field
            name="birthDay"
            render={({ field }) => (
              <div>
                <Input {...field} type="tel" placeholder="dd" />
              </div>
            )}
          />
          {"/"}
          <Field
            name="birthMonth"
            render={({ field }) => (
              <div>
                <Input {...field} type="tel" placeholder="mm" />
              </div>
            )}
          />
          {"/"}
          <Field
            name="birthYear"
            render={({ field }) => (
              <div>
                <Input {...field} type="tel" placeholder="yyyy" />
              </div>
            )}
          />
          <Field
            name="birthDate"
            render={({ field }) => (
              <div>
                <Input
                  {...field}
                  type="text"
                  value={`${this.state.birthYear}-${this.state.birthMonth}-${this.state.birthDay}`}
                  hidden
                />
              </div>
            )}
          />
        </div>
      </FormGroup>
    );
  }
}
