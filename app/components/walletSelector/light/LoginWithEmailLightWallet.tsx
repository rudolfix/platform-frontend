import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";

import { FormField } from "../../../components/shared/forms/forms";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";

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

interface IOwnProps {
  email: string;
}

const LoginLightWalletForm = (formikBag: FormikProps<IFormValues>) => (
  <Form>
    <FormField type="password" placeholder="Password" name={PASSWORD} />
    <div className="text-center">
      <Button type="submit" disabled={!formikBag.values.password}>
        Login
      </Button>
    </div>
  </Form>
);

const LoginEnhancedLightWalletForm = withFormik<IProps, IFormValues>({
  mapPropsToValues: props => props.currentValues as IFormValues,
  handleSubmit: (values, props) => props.props.submitForm(values),
})(LoginLightWalletForm);

export const LoginWithEmailLightWalletComponent: React.SFC<
  IProps & IStateProps & IOwnProps
> = props => {
  return (
    <>
      <Row>
        <p className="small mx-auto">Sign in to your Neufund wallet.</p>
      </Row>
      <Row>
        <Col xs={12}>
          <FormConstantField value={props.email} className="mb-2" />
          <LoginEnhancedLightWalletForm {...props} />
          {props.errorMsg && <WarningAlert>{props.errorMsg}</WarningAlert>}
        </Col>
      </Row>
    </>
  );
};

export const LoginWithEmailLightWallet = compose<React.SFC<IOwnProps>>(
  appConnect<IStateProps, IProps, IOwnProps>({
    stateToProps: state => ({
      errorMsg: state.lightWalletWizard.errorMsg,
    }),
    dispatchToProps: (dispatch, ownProps) => ({
      submitForm: (values: IFormValues) => {
        dispatch(actions.walletSelector.lightWalletLogin(ownProps.email, values.password));
      },
    }),
  }),
)(LoginWithEmailLightWalletComponent);
