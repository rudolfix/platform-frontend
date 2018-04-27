import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col } from "reactstrap";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import {
  selectDoesEmailExist,
  selectIsThereUnverifiedEmail,
  selectIsUserEmailVerified,
  selectVerifiedUserEmail,
} from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { IIntlProps, injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { Button } from "../../shared/Buttons";
import { PanelDark } from "../../shared/PanelDark";

import { Form, FormikProps, withFormik } from "formik";
import * as Yup from "yup";
import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import { FormField } from "../../shared/forms/formField/FormField";
import * as styles from "./VerifyEmailWidget.module.scss";

interface IStateProps {
  isUserEmailVerified: boolean;
  isThereUnverifiedEmail: boolean;
  doesEmailExist: boolean;
  email?: string;
}

interface IDispatchProps {
  resendEmail: () => void;
  addNewEmail?: (values: { email: string }) => void;
}

const SetEmailForm = (formikBag: FormikProps<any> & any) => (
  <Form className={cn(styles.content, "mt-0 pt-0 mb-0")}>
    <FormField placeholder="Email address" name="email" />
    <div className="text-center">
      <Button type="submit" disabled={!formikBag.isValid}>
        <FormattedMessage id="form.button.submit" />
      </Button>
    </div>
  </Form>
);

const EmailFormSchema = Yup.object().shape({
  email: Yup.string()
    .email()
    .required(),
});

const SetEmailEnhancedForm = withFormik<any, any>({
  validationSchema: EmailFormSchema,
  isInitialValid: () => EmailFormSchema.isValidSync(false),
  mapPropsToValues: props => props.currentValues,
  handleSubmit: (values, props) => props.props.handleSubmit(values),
})(SetEmailForm);

const VerifiedUser: React.SFC<{ email?: string }> = ({ email }) => (
  <div
    data-test-id="verified-section"
    className={cn(styles.content, "d-flex flex-wrap align-content-around")}
  >
    <p className={cn(styles.text, "pt-2")}>
      <FormattedMessage id="settings.verify-email-widget.email-is-verified" />
    </p>
    <Col xs={12} className="d-flex justify-content-center" data-test-id="resend-link">
      <p>{email}</p>
    </Col>
  </div>
);

const UnVerifiedUser: React.SFC<{
  isThereUnverifiedEmail: boolean;
  resendEmail: () => void;
}> = ({ isThereUnverifiedEmail, resendEmail }) => (
  <div
    data-test-id="unverified-section"
    className={cn(styles.content, "d-flex flex-wrap align-content-around")}
  >
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
          <VerifiedUser email={email} />
        ) : (
          <UnVerifiedUser
            isThereUnverifiedEmail={isThereUnverifiedEmail}
            resendEmail={resendEmail}
          />
        )
      ) : (
        <div className={styles.content}>
          <p className="pt-2">
            <FormattedMessage id="settings.verify-email-widget.enter-email" />
          </p>
          <SetEmailEnhancedForm handleSubmit={addNewEmail} />
        </div>
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
