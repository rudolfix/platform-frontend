import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { FormField } from "../../../components/shared/forms/forms";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";

import * as Yup from "yup";
import { flows } from "../../../modules/flows";

const EMAIL = "email";
const PASSWORD = "password";
const REPEAT_PASSWORD = "repeatPassword";

export interface IFormValues {
  email: string;
  password: string;
  repeatPassword: string;
}

interface IProps {
  submitForm: (values: IFormValues) => void;
  currentValues?: IFormValues;
}

const validationSchema = Yup.object().shape({
  [EMAIL]: Yup.string()
    .required("Required")
    .email("Wrong email format"),
  [PASSWORD]: Yup.string()
    .required("Required")
    .min(8, "Must be longer than 8"),
  [REPEAT_PASSWORD]: Yup.string()
    .required("Required")
    .oneOf([Yup.ref(PASSWORD)], "Passwords are not equal"),
});

const RegisterLightWalletForm = (formikBag: FormikProps<IFormValues>) => (
  <Form>
    <FormField
      placeholder="Email"
      type="email"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={EMAIL}
    />
    <FormField
      type="password"
      placeholder="Password"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={PASSWORD}
    />
    <FormField
      type="password"
      placeholder="Repeat Password"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={REPEAT_PASSWORD}
    />
    <div className="text-center">
      <Button type="submit" disabled={!formikBag.isValid}>
        REGISTER
      </Button>
    </div>
  </Form>
);

const RegisterEnhancedLightWalletForm = withFormik<IProps, IFormValues>({
  validationSchema: validationSchema,
  mapPropsToValues: props => props.currentValues as IFormValues,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(RegisterLightWalletForm);

export const RegisterWalletComponent: React.SFC<IProps> = props => {
  return (
    <Row className="justify-content-sm-center mt-3">
      <Col className="align-self-end col-sm-auto col-xs-12">
        <h1 className="mb-4">Create your Neufund wallet</h1>
        <RegisterEnhancedLightWalletForm {...props} />
      </Col>
    </Row>
  );
};

export const RegisterLightWallet = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) =>
        dispatch(flows.wallet.tryConnectingWithLightWallet(values.email, values.password)),
    }),
  }),
)(RegisterWalletComponent);
