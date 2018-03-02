import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { FormField } from "../../../components/shared/forms/forms";
import { appConnect } from "../../../store";
import { ButtonPrimary } from "../../shared/Buttons";

import { FormConstantField } from "../../shared/forms/formField/FormConstantField";

const PASSWORD = "password";

export interface IFormValues {
  password: string;
}

interface IProps {
  submitForm: (values: IFormValues) => void;
  currentValues?: IFormValues;
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
      <ButtonPrimary type="submit" disabled={!formikBag.isValid}>
        Login
      </ButtonPrimary>
    </div>
  </Form>
);

const LoginEnhancedLightWalletForm = withFormik<IProps, IFormValues>({
  mapPropsToValues: props => props.currentValues as IFormValues,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(LoginLightWalletForm);

export const LoginWithEmailLightWalletComponent: React.SFC<IProps> = props => {
  return (
    <>
      <Row>
        <p className="small mx-auto">Sign in to your Neufund wallet.</p>
      </Row>
      <Row>
        <Col xs={12}>
          <FormConstantField value="krzkaczor@gmail.com" className="mb-2" />
          <LoginEnhancedLightWalletForm {...props} />
        </Col>
      </Row>
    </>
  );
};

export const LoginWithEmailLightWallet = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) => {
        console.log("Form dispatched!", values);
      },
    }),
  }),
)(LoginWithEmailLightWalletComponent);
