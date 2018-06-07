import { Form, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import { Schema } from "yup";

import * as YupTS from "../../../lib/yup-ts";
import { PercentageIndicatorBar } from "../../shared/PercentageIndicatorBar";
import { Section } from "./Shared";

import { etoFlowInitialState } from "../../../modules/eto-flow/reducer";
import * as styles from "./EtoFormBase.module.scss";

interface IProps {
  title: string;
  schema: YupTS.Schema<any>;
}

function getErrorsNumber(validator: Schema, data: any): number {
  try {
    validator.validateSync(data, { abortEarly: false });
    return 0;
  } catch (e) {
    return e.errors.length;
  }
}

// todo: it doesnt return percentage
export const selectPercentageDone = (
  schema: YupTS.Schema<any>,
  formState: any,
  initialFormState: any,
): number => {
  const validator = schema.toYup();

  const errors = getErrorsNumber(validator, formState);
  const maximumErrors = getErrorsNumber(validator, initialFormState.data);

  if (maximumErrors === 0) {
    return 1;
  }

  return 1 - errors / maximumErrors;
};

interface IPercentageDoneProps {
  schema: YupTS.Schema<any>;
}

class PercentageFormDone extends React.Component<IPercentageDoneProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    const { values } = this.context.formik as FormikProps<any>;

    const calculatedPercentage =
      selectPercentageDone(this.props.schema, values, etoFlowInitialState) * 100;

    return <PercentageIndicatorBar percent={calculatedPercentage} className="mb-5" />;
  }
}

export const EtoFormBase: React.SFC<IProps> = ({ children, title, schema }) => (
  <div>
    <Form className="py-4">
      <h4 className={styles.header}>{title}</h4>

      <Section>
        <PercentageFormDone schema={schema} />
      </Section>

      {children}
    </Form>
  </div>
);
