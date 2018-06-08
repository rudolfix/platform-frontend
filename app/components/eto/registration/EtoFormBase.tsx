import { Form, FormikProps } from "formik";
import * as PropTypes from "prop-types";
import * as React from "react";
import * as Yup from "yup";

import { etoFlowInitialState } from "../../../modules/eto-flow/reducer";
import { selectFormFractionDone } from "../../../modules/eto-flow/selectors";
import { PercentageIndicatorBar } from "../../shared/PercentageIndicatorBar";
import { Section } from "./Shared";

import * as styles from "./EtoFormBase.module.scss";

interface IProps {
  title: string;
}

interface IFormPercentageDoneProps {
  validator: Yup.Schema;
}

class PercentageFormDone extends React.Component<IFormPercentageDoneProps> {
  static contextTypes = {
    formik: PropTypes.object,
  };

  render(): React.ReactNode {
    const { values } = this.context.formik as FormikProps<any>;

    const calculatedFraction = selectFormFractionDone(
      this.props.validator,
      values,
      etoFlowInitialState,
    );

    return <PercentageIndicatorBar fraction={calculatedFraction} className="mb-5" />;
  }
}

export const EtoFormBase: React.SFC<IProps & IFormPercentageDoneProps> = ({
  children,
  title,
  validator,
}) => (
  <div>
    <Form className="py-4">
      <h4 className={styles.header}>{title}</h4>

      <Section>
        <PercentageFormDone validator={validator} />
      </Section>

      {children}
    </Form>
  </div>
);
