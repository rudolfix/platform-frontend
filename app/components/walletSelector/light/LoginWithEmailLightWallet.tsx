import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { FormField } from "../../../components/shared/forms/forms";
import { appConnect } from "../../../store";
import { ButtonPrimary } from "../../shared/Buttons";

import { actions } from "../../../modules/actions";
import { FormConstantField } from "../../shared/forms/formField/FormConstantField";
import { WarningAlert } from "../../shared/WarningAlert";

const PASSWORD = "password";

export interface IFormValues {
  password: string;
}

interface IProps {
  submitForm: (values: IFormValues) => void;
  currentValues?: IFormValues;
}

interface IStateProps {
  errorMsg?: string;
}

const LoginLightWalletForm = (formikBag: FormikProps<IFormValues>) => (
  <Form>
    <FormField
      type={"password"}
      placeholder="Password"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={PASSWORD}
    />
    <div className="text-center">
      <ButtonPrimary type="submit" disabled={!formikBag.values.password}>
        Login
      </ButtonPrimary>
    </div>
  </Form>
);

const LoginEnhancedLightWalletForm = withFormik<IProps, IFormValues>({
  mapPropsToValues: props => props.currentValues as IFormValues,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(LoginLightWalletForm);

export const LoginWithEmailLightWalletComponent: React.SFC<IProps & IStateProps> = props => {
  return (
    <>
      <Row>
        <p className="small mx-auto">Sign in to your Neufund wallet.</p>
      </Row>
      <Row>
        <Col xs={12}>
          <FormConstantField value="krzkaczor@gmail.com" className="mb-2" />
          <LoginEnhancedLightWalletForm {...props} />
          {props.errorMsg && <WarningAlert>{props.errorMsg}</WarningAlert>}
        </Col>
      </Row>
    </>
  );
};

export const LoginWithEmailLightWallet = compose<React.SFC>(
  appConnect<IStateProps, IProps>({
    stateToProps: state => ({
      errorMsg: state.lightWalletWizard.errorMsg,
    }),
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) => {
        dispatch(actions.wallet.lightWalletLogin(values.password));
      },
    }),
  }),
)(LoginWithEmailLightWalletComponent);
