import { Button, EButtonLayout } from "@neufund/design-system";
import { injectIntlHelpers } from "@neufund/shared";
import { FormikProps, withFormik } from "formik";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";
import * as Yup from "yup";

import { TDataTestId } from "../../../types";
import { FormDeprecated, FormField } from "../../shared/forms/index";
import { connectVerifyEmailComponent } from "./ConnectVerifyEmail";

import * as styles from "./AccountSetupVerifyEmailComponent.module.scss";

interface IStateProps {
  isUserEmailVerified: boolean;
  isThereUnverifiedEmail: boolean;
  verifiedEmail?: string;
  unverifiedEmail?: string;
  isLocked?: boolean;
  isEmailTemporaryCancelled: boolean;
}

interface IEnhancedFormProps {
  handleSubmit: (values: IFormValues) => void;
  isLocked?: boolean;
  revertCancelEmail: () => void;
  isThereUnverifiedEmail?: boolean;
  verifiedEmail?: string;
}

interface IDispatchProps {
  resendEmail: () => void;
  addNewEmail: (values: { email: string }) => void;
  cancelEmail: () => void;
  revertCancelEmail: () => void;
  abortEmailUpdate: () => void;
}

interface IFormValues {
  email: string;
}

interface INoEMailUser {
  addNewEmail: (values: { email: string }) => void;
  isLocked?: boolean;
  revertCancelEmail: () => void;
}

interface IUnverifiedEmailWidgetProps {
  resendEmail: () => void;
  unverifiedEmail: string;
  cancelEmail: () => void;
  abortEmailUpdate: () => void;
}

interface INoEmailWidgetProps {
  cancelEmail: () => void;
  abortEmailUpdate: () => void;
}

const EmailFormSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
});

/**
 * Workaround for: https://github.com/jaredpalmer/formik/issues/621
 */
function isValid(props: FormikProps<IFormValues>): boolean {
  const noErrors = Object.keys(props.errors).length === 0;
  const notEmpty = !!props.values.email;

  return noErrors && notEmpty;
}

const SetEmailFormLayout = injectIntlHelpers<IEnhancedFormProps & FormikProps<IFormValues>>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <FormDeprecated className={styles.form}>
      <FormField
        placeholder={formatIntlMessage("settings.verify-email-widget.email-placeholder")}
        name="email"
        data-test-id="verify-email-widget-form-email-input"
      />
      <div className={styles.buttonWrapper}>
        <Button
          data-test-id="verify-email-widget-form-cancel"
          layout={EButtonLayout.GHOST}
          onClick={props.revertCancelEmail}
        >
          <FormattedMessage id="form.button.cancel" />
        </Button>
        <Button
          type="submit"
          layout={EButtonLayout.GHOST}
          disabled={!isValid(props) || props.isLocked}
          data-test-id="verify-email-widget-form-submit"
        >
          <FormattedMessage id="form.button.submit" />
        </Button>
      </div>
    </FormDeprecated>
  ),
);

const SetEmailForm = withFormik<IEnhancedFormProps, IFormValues>({
  validationSchema: EmailFormSchema,
  handleSubmit: (values, props) => props.props.handleSubmit(values),
})(SetEmailFormLayout);

const ChangeEmailForm: React.FunctionComponent<INoEMailUser> = ({
  addNewEmail,
  isLocked,
  revertCancelEmail,
}) => (
  <section
    data-test-id="profile.verify-email-widget.no-email-state"
    className={styles.changeEmailForm}
  >
    <p className={styles.text}>
      <FormattedMessage id="settings.verify-email-widget.enter-email" />
    </p>
    <SetEmailForm
      handleSubmit={addNewEmail}
      isLocked={isLocked}
      revertCancelEmail={revertCancelEmail}
    />
  </section>
);

const UnverifiedEmail: React.FunctionComponent<IUnverifiedEmailWidgetProps & TDataTestId> = ({
  resendEmail,
  unverifiedEmail,
  cancelEmail,
}) => (
  <section className={styles.section} data-test-id="account-setup-email-unverified-section">
    <p className={styles.text}>
      <FormattedMessage id="account-setup.verify-email-widget.text" />
      <span data-test-id="profile.verify-email-widget.unverified-email">{unverifiedEmail}</span>
    </p>
    <Button
      layout={EButtonLayout.PRIMARY}
      onClick={cancelEmail}
      data-test-id="verify-email-widget.change-email.button"
    >
      <FormattedMessage id="account-setup.verify-email-widget.change-email" />
    </Button>
    {unverifiedEmail && (
      <Button layout={EButtonLayout.OUTLINE} onClick={resendEmail} data-test-id="resend-link">
        <FormattedMessage id="account-setup.verify-email-widget.resend-link" />
      </Button>
    )}
  </section>
);

const NoEmail: React.FunctionComponent<INoEmailWidgetProps & TDataTestId> = ({ cancelEmail }) => (
  <section className={styles.section} data-test-id="account-setup-no-email-section">
    <p className={styles.text}>
      <FormattedMessage id="account-setup.set-email-widget.text" />
    </p>
    <Button
      layout={EButtonLayout.PRIMARY}
      onClick={cancelEmail}
      data-test-id="verify-email-widget.set-email.button"
    >
      <FormattedMessage id="account-setup.verify-email-widget.set-email" />
    </Button>
  </section>
);

const AccountSetupSetEmailWidget = compose<
  IStateProps & IDispatchProps,
  IStateProps & IDispatchProps
>(
  branch(
    ({ isEmailTemporaryCancelled }: IStateProps) => isEmailTemporaryCancelled,
    renderComponent(ChangeEmailForm),
  ),
  branch(
    ({ unverifiedEmail }: IStateProps) => unverifiedEmail !== undefined,
    renderComponent(UnverifiedEmail),
  ),
)(NoEmail);

const SetEmailComponent = connectVerifyEmailComponent<{}>(AccountSetupSetEmailWidget);

export { SetEmailComponent, AccountSetupSetEmailWidget };
