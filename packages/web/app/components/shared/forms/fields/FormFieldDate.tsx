import { Field, FieldProps } from "formik";
import * as React from "react";
import { FormGroup, Input } from "reactstrap";

import { TDataTestId, TTranslatedString } from "../../../../types";
import { generateErrorId } from "../layouts/FormError";
import { FormFieldError } from "./FormFieldError";
import { FormFieldLabel } from "./FormFieldLabel";
import { useFieldMeta } from "./utils";

import * as styles from "./FormFieldDate.module.scss";

interface IProps {
  disabled?: boolean;
  label: TTranslatedString;
  name: string;
}

const positionMap = {
  year: 0,
  month: 1,
  day: 2,
};

enum EFieldDateType {
  YEAR = "year",
  MONTH = "month",
  DAY = "day",
}

const FormFieldDate: React.FunctionComponent<IProps & TDataTestId> = ({
  name,
  label,
  "data-test-id": dataTestId,
  disabled,
}) => {
  const [cache, setCache] = React.useState({
    [EFieldDateType.DAY]: "",
    [EFieldDateType.MONTH]: "",
    [EFieldDateType.YEAR]: "",
  });

  const monthInput: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);
  const yearInput: React.RefObject<HTMLInputElement> = React.useRef<HTMLInputElement>(null);

  const onChange = (
    type: EFieldDateType,
    e: React.FormEvent<HTMLInputElement>,
    handler: (e: React.FormEvent<HTMLInputElement>) => void,
  ) => {
    const newCache = {
      ...cache,
      [type]: e.currentTarget.value,
    };

    setCache(newCache);

    e.currentTarget.value = `${newCache.year}-${newCache.month}-${newCache.day}`;

    handler(e);
  };

  const fromValue = (type: EFieldDateType, value: string = ""): string => {
    const items = value.split("-");

    return items.length === 3 ? items[positionMap[type]] : "";
  };

  const { invalid } = useFieldMeta(name);

  return (
    <FormGroup data-test-id={dataTestId}>
      <div className={styles.dateField}>
        <FormFieldLabel className={styles.label} name={name}>
          {label}
        </FormFieldLabel>
        <div className={styles.inputsWrapper}>
          <Field name={name}>
            {({ field }: FieldProps) => (
              <Input
                {...field}
                data-test-id="form-field-date-day"
                aria-describedby={generateErrorId(name)}
                aria-invalid={invalid}
                className={styles.input}
                invalid={invalid}
                disabled={disabled}
                onChange={e => {
                  onChange(EFieldDateType.DAY, e, field.onChange);
                  // auto advance to next field
                  const realValue = fromValue(EFieldDateType.DAY, e.target.value);
                  if (realValue.length === 2) {
                    monthInput.current!.focus();
                  }
                }}
                value={fromValue(EFieldDateType.DAY, field.value)}
                placeholder="DD"
                maxLength={2}
              />
            )}
          </Field>
          {"/"}
          <Field name={name}>
            {({ field }: FieldProps) => (
              <Input
                {...field}
                data-test-id="form-field-date-month"
                aria-describedby={generateErrorId(name)}
                aria-invalid={invalid}
                className={styles.input}
                invalid={invalid}
                disabled={disabled}
                onChange={e => {
                  onChange(EFieldDateType.MONTH, e, field.onChange);

                  // auto advance to next field
                  const realValue = fromValue(EFieldDateType.MONTH, e.target.value);
                  if (realValue.length === 2) {
                    yearInput.current!.focus();
                  }
                }}
                value={fromValue(EFieldDateType.MONTH, field.value)}
                placeholder="MM"
                maxLength={2}
                innerRef={monthInput}
              />
            )}
          </Field>
          {"/"}
          <Field name={name}>
            {({ field }: FieldProps) => (
              <Input
                {...field}
                data-test-id="form-field-date-year"
                aria-describedby={generateErrorId(name)}
                aria-invalid={invalid}
                className={styles.input}
                invalid={invalid}
                disabled={disabled}
                onChange={e => onChange(EFieldDateType.YEAR, e, field.onChange)}
                value={fromValue(EFieldDateType.YEAR, field.value)}
                placeholder="YYYY"
                maxLength={4}
                innerRef={yearInput}
              />
            )}
          </Field>
        </div>
      </div>
      <FormFieldError name={name} />
    </FormGroup>
  );
};

export { FormFieldDate };
