import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col } from "reactstrap";
import { compose } from "redux";

import { Form, FormikProps, withFormik } from "formik";
import * as Yup from "yup";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import { actions } from "../../../modules/actions";
import {
  selectDoesEmailExist,
  selectIsThereUnverifiedEmail,
  selectIsUserEmailVerified,
  selectVerifiedUserEmail,
} from "../../../modules/auth/selectors";
import { selectIsConnectedButtonLocked } from "../../../modules/verifyEmailWidget/reducer";
import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { Button } from "../../shared/Buttons";
import { FormField } from "../../shared/forms/formField/FormField";
import { PanelDark } from "../../shared/PanelDark";
import * as styles from "./VerifyEmailWidget.module.scss";

interface IStateProps {
  isUserEmailVerified: boolean;
  isThereUnverifiedEmail: boolean;
  doesEmailExist: boolean;
  email?: string;
  isLocked?: boolean;
}

interface IEnhancedFormProps {
  handleSubmit: (values: IFormValues) => void;
  isLocked?: boolean;
}

interface IDispatchProps {
  resendEmail: () => void;
  addNewEmail: (values: { email: string }) => void;
}

interface IFormValues {
  email: string;
}

interface INoEMailUser {
  addNewEmail: (values: { email: string }) => void;
  isLocked?: boolean;
}

const SetEmailForm = injectIntlHelpers<IEnhancedFormProps & FormikProps<IFormValues>>(
  ({ intl: { formatIntlMessage }, ...props }) => (
    <Form className={cn(styles.content, "mt-0 pt-0 mb-0")}>
      <FormField
        placeholder={formatIntlMessage("settings.verify-email-widget.email-placeholder")}
        name="email"
      />
      <div className="text-center">
        <Button type="submit" disabled={!props.isValid || props.isLocked}>
          <FormattedMessage id="form.button.submit" />
        </Button>
      </div>
    </Form>
  ),
);

const EmailFormSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
});

const SetEmailEnhancedForm = withFormik<IEnhancedFormProps, IFormValues>({
  validationSchema: EmailFormSchema,
  isInitialValid: () => EmailFormSchema.isValidSync(false),
  handleSubmit: (values, props) => props.props.handleSubmit(values),
})(SetEmailForm);

const NoEmailUser: React.SFC<INoEMailUser> = ({ addNewEmail, isLocked }) => (
  <div className={styles.content}>
    <p className={styles.customPaddingTop}>
      <FormattedMessage id="settings.verify-email-widget.enter-email" />
    </p>
    <SetEmailEnhancedForm handleSubmit={addNewEmail} isLocked={isLocked} />
  </div>
);
const VerifiedUser: React.SFC<{ email?: string }> = ({ email }) => (
  <div className={cn(styles.content, "d-flex flex-wrap align-content-around")}>
    <p className={cn(styles.text, "pt-2")}>
      <FormattedMessage id="settings.verify-email-widget.email-is-verified" />
    </p>
    <Col xs={12} className="d-flex justify-content-center">
      <p>{email}</p>
    </Col>
  </div>
);

const UnVerifiedUser: React.SFC<{
  isThereUnverifiedEmail: boolean;
  resendEmail: () => void;
}> = ({ isThereUnverifiedEmail, resendEmail }) => (
  <div className={cn(styles.content, "d-flex flex-wrap align-content-around")}>
    <p className={cn(styles.text, "pt-2")}>
      <FormattedMessage id="settings.verify-email-widget.you-need-to-verify-email" />
    </p>
    {isThereUnverifiedEmail && (
      <Col xs={12} className="d-flex justify-content-center" data-test-id="resend-link">
        <Button
          layout="secondary"
          iconPosition="icon-after"
          svgIcon={arrowRight}
          onClick={resendEmail}
        >
          <FormattedMessage id="settings.verify-email-widget.resend-link" />
        </Button>
      </Col>
    )}
  </div>
);
export const VerifyEmailWidgetComponent: React.SFC<IStateProps & IDispatchProps & IIntlProps> = ({
  intl: { formatIntlMessage },
  isUserEmailVerified,
  isThereUnverifiedEmail,
  doesEmailExist,
  email,
  resendEmail,
  addNewEmail,
  isLocked,
}) => {
  return (
    <PanelDark
      headerText={formatIntlMessage("settings.verify-email-widget.header")}
      rightComponent={
        isUserEmailVerified ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" />
        )
      }
    >
      {doesEmailExist ? (
        isUserEmailVerified ? (
          <VerifiedUser {...{ email }} data-test-id="verified-section" />
        ) : (
          <UnVerifiedUser
            {...{ isThereUnverifiedEmail, resendEmail }}
            data-test-id="unverified-section"
          />
        )
      ) : (
        <NoEmailUser {...{ addNewEmail, isLocked }} />
      )}
    </PanelDark>
  );
};

export const VerifyEmailWidget = compose<React.SFC>(
  appConnect<IStateProps, IDispatchProps, {}>({
    stateToProps: s => ({
      isUserEmailVerified: selectIsUserEmailVerified(s.auth),
      isThereUnverifiedEmail: selectIsThereUnverifiedEmail(s.auth),
      doesEmailExist: selectDoesEmailExist(s.auth),
      email: selectVerifiedUserEmail(s.auth),
      isLocked: selectIsConnectedButtonLocked(s.verifyEmailWidgetState),
    }),
    dispatchToProps: dispatch => ({
      resendEmail: () => {
        dispatch(actions.settings.resendEmail());
      },
      addNewEmail: (values: { email: string }) => {
        dispatch(actions.settings.addNewEmail(values.email));
      },
    }),
  }),
  injectIntlHelpers,
)(VerifyEmailWidgetComponent);
