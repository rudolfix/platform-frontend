import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { Col, Row } from "reactstrap";
import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";
import { FormField } from "../../shared/forms/formField/FormField";
import { PanelDark } from "../../shared/PanelDark";

const EMAIL = "email";

interface IDispatchProps {
  submitForm: (values: IFormValues) => void;
  currentValues?: IFormValues;
}

interface IFormValues {
  email: string;
}

const ChangeEmailForm = (formikBag: FormikProps<IFormValues>) => (
  <Form>
    <FormField
      type={"email"}
      placeholder="Enter new email"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name={EMAIL}
    />
    <div className="text-center">
      <Button type="submit" disabled={!formikBag.values.email}>
        Submit
      </Button>
    </div>
  </Form>
);

const SettingsEnhancedChangeEmailForm = withFormik<IDispatchProps, IFormValues>({
  mapPropsToValues: props => props.currentValues as IFormValues,
  handleSubmit: (values, props) => {
    props.props.submitForm(values);
    values.email = "";
  },
})(ChangeEmailForm);

export const ChangeEmailComponent: React.SFC<IDispatchProps> = props => {
  return (
    <PanelDark headerText="CHANGE MY E-MAIL ADDRESS">
      <Row>
        <Col xs={6} className="mt-3">
          <p data-test-id="paragraph-section">
            Lorem ipsum dolor sit amet, consetetur, sadpcsi and then that is how you get the email
          </p>
        </Col>
        <Col className="mt-3 mb-4" data-test-id="form-section">
          <SettingsEnhancedChangeEmailForm {...props} />
        </Col>
      </Row>
    </PanelDark>
  );
};

export const ChangeEmail = appConnect<IDispatchProps>({
  dispatchToProps: dispatch => ({
    submitForm: (values: IFormValues) => {
      dispatch(actions.settings.addNewEmail(values.email));
    },
  }),
})(ChangeEmailComponent);
