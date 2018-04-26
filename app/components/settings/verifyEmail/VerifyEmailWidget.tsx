import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl";
import { Col } from "reactstrap";

import { actions } from "../../../modules/actions";
import {
  selectIsThereUnverifiedEmail,
  selectIsUserEmailVerified,
  selectVerifiedUserEmail,
} from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { injectIntlHelpers } from "../../../utils/injectIntlHelpers";
import { Button } from "../../shared/Buttons";
import { PanelDark } from "../../shared/PanelDark";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";
import * as styles from "./VerifyEmailWidget.module.scss";

interface IStateProps {
  isUserEmailVerified: boolean;
  isThereUnverifiedEmail: boolean;
  email?: string;
}

interface IDispatchProps {
  resendEmail: () => void;
}

export const VerifyEmailWidgetComponent = injectIntlHelpers<IStateProps & IDispatchProps>(
  ({
    intl: { formatIntlMessage },
    isUserEmailVerified,
    isThereUnverifiedEmail,
    email,
    resendEmail
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
      {isUserEmailVerified ? (
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
      ) : (
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
      )}
    </PanelDark>
  );
});

export const VerifyEmailWidget = appConnect<IStateProps, IDispatchProps, {}>({
  stateToProps: s => ({
    isUserEmailVerified: selectIsUserEmailVerified(s.auth),
    isThereUnverifiedEmail: selectIsThereUnverifiedEmail(s.auth),
    email: selectVerifiedUserEmail(s.auth),
  }),
  dispatchToProps: dispatch => ({
    resendEmail: () => {
      dispatch(actions.settings.resendEmail());
    },
  }),
})(VerifyEmailWidgetComponent);
