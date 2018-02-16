import { Form, Formik, FormikProps } from "formik";
import * as React from "react";
import { Button, Col, Row } from "reactstrap";
import { compose } from "redux";
import { FormField } from "../../../components/shared/forms/forms";
import { appConnect } from "../../../store";

import * as Yup from "yup";
import { flows } from "../../../modules/flows";

const EMAIL = "email";
const PASSWORD = "password";
const REPEAT_PASSWORD = "repeatPassword";

interface IFormValues {
  email?: string;
  password?: string;
  repeatPassword?: string;
}

interface IProps {
  submitForm: (values: IFormValues) => void;
  currentValues: IFormValues;
}

const validate = () => {};

const validationSchema = Yup.object().shape({
  [EMAIL]: Yup.string()
    .required("Email")
    .email("Email"),
  [PASSWORD]: Yup.string()
    .required("Password")
    .min(8, "Must be longer than 3"),
  [REPEAT_PASSWORD]: Yup.string()
    .required("Password")
    .min(8, "Must be longer than 3"),
});

const CreateLightWalletForm = (formikBag: FormikProps<IFormValues>) => (
  <Form>
    <FormField
      label="Email"
      type={"email"}
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={EMAIL}
    />
    <FormField
      type={"password"}
      label="Password"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={PASSWORD}
    />
    <FormField
      type={"password"}
      label="RepeatPassword"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={REPEAT_PASSWORD}
    />
    <Button color="primary" type="submit" disabled={!formikBag.isValid}>
      Submit
    </Button>
  </Form>
);
const CreateEnhancedLightWalletForm = (props: IProps) => (
  <Formik
    initialValues={props.currentValues}
    onSubmit={props.submitForm}
    render={CreateLightWalletForm}
    validate={validate}
    validationSchema={validationSchema}
  />
);

export const CreateWalletComponent: React.SFC<any> = props => {
  return (
    <Row className="justify-content-sm-center mt-3">
      <Col sm="5" className="align-self-end">
        <CreateEnhancedLightWalletForm {...props} />
      </Col>
    </Row>
  );
};

export const CreateWallet = compose<React.SFC>(
  appConnect<IProps>({
    dispatchToProps: dispatch => ({
      submitForm: (values: IFormValues) =>
        dispatch(
          flows.wallet.tryConnectingWithLightWallet(
            values.email as string,
            values.password as string,
          ),
        ),
    }),
  }),
)(CreateWalletComponent);

//Solve IFormValues complain when elements are not optional
