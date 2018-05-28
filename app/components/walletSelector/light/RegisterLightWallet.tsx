import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { Link } from "react-router-dom";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import * as Yup from "yup";
import { InfoBlock } from "../../shared/InfoBlock";

import { FormField } from "../../../components/shared/forms/forms";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";

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
    {/* TODO: ADD TRANSALTIONS */}
    <FormField
      placeholder="Email Address"
      type="email"
      name={EMAIL}
      data-test-id="wallet-selector-register-email"
    />
    <FormField
      type="password"
      placeholder="Password"
      name={PASSWORD}
      data-test-id="wallet-selector-register-password"
    />
    <FormField
      type="password"
      placeholder="Confirm Password"
      name={REPEAT_PASSWORD}
      data-test-id="wallet-selector-register-confirm-password"
    />
    <div className="text-center">
      <Button
        type="submit"
        disabled={!formikBag.isValid}
        data-test-id="wallet-selector-register-button"
      >
        <FormattedMessage id="wallet-selector.neuwallet.register" />
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
    <>
      <Row>
        <Col xs={12} md={{ size: 8, offset: 2 }}>
          <InfoBlock>
            <FormattedMessage id="wallet-selector.light.icbm-info.message" />{" "}
            <Link
              to="https://neufund.freshdesk.com/support/solutions/articles/36000060442-icbm-investors-registration"
              target="_blank"
            >
              <FormattedMessage id="wallet-selector.light.icbm-info.read-more-here" />
            </Link>
          </InfoBlock>
        </Col>
      </Row>
      <Row className="justify-content-sm-center mt-3">
        <Col className="align-self-end col-sm-auto col-xs-12">
          <h1 className="mb-4">
            <FormattedMessage id="wallet-selector.neuwallet.register-prompt" />
          </h1>
          <RegisterEnhancedLightWalletForm {...props} />
        </Col>
      </Row>
    </>
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
