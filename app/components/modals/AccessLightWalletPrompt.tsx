import { Form, FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl";

import { Button } from "../shared/Buttons";
import { FormField } from "../shared/forms/forms";

interface IStateProps {
  isUnlocked: boolean;
}

interface IOwnProps {
  onCancel: () => void;
  onAccept: (password?: string) => void;
}

type IProps = IStateProps & IOwnProps;

export interface IFormValues {
  password: string;
}

const AccessLightWalletForm = (formikBag: FormikProps<IFormValues> & IProps) => (
  <Form>
    <FormField
      type="password"
      placeholder="Password"
      touched={formikBag.touched}
      errors={formikBag.errors}
      name="password"
    />
    <div className="mt-3">
      <Button type="submit" disabled={!formikBag.values.password}>
        {" "}
        <FormattedMessage id="form.button.accept" />
      </Button>
      <Button layout="secondary" onClick={formikBag.onCancel}>
        <FormattedMessage id="form.button.reject" />
      </Button>
    </div>
  </Form>
);

const EnhancedForm = withFormik<IProps, IFormValues>({
  handleSubmit: (values, props) => props.props.onAccept(values.password),
})(AccessLightWalletForm);

export const AccessLightWalletPrompt: React.SFC<IProps> = props =>
  props.isUnlocked ? (
    <div className="mt-3">
      <Button onClick={() => props.onAccept()}>Accept</Button>
      <Button layout="secondary" onClick={props.onCancel}>
        <FormattedMessage id="form.button.reject" />
      </Button>
    </div>
  ) : (
    <div>
      <p>
        <FormattedMessage id="modal.light-wallet.message" />
      </p>
      <EnhancedForm {...props} />
    </div>
  );
