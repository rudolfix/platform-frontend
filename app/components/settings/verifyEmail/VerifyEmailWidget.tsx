import * as cn from "classnames";
import * as React from "react";
import * as styles from "./VerifyEmailWidget.module.scss";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notifications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notifications/warning.svg";

import { Col } from "reactstrap";
import { actions } from "../../../modules/actions";
import {
  selectIsThereUnverifiedEmail,
  selectIsUserEmailVerified,
  selectVerifiedUserEmail,
} from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";
import { PanelDark } from "../../shared/PanelDark";

interface IStateProps {
  isUserEmailVarified: boolean;
  isThereUnverifiedEmail: boolean;
  unverifiedEmail?: string;
}

interface IDispatchProps {
  resendEmail: () => void;
}

export const VerifyEmailWidgetComponent: React.SFC<IStateProps & IDispatchProps> = ({
  isUserEmailVarified,
  isThereUnverifiedEmail,
  resendEmail,
}) => {
  return (
    <PanelDark
      headerText="EMAIL VERIFICATION"
      rightComponent={
        isUserEmailVarified ? (
          <img src={successIcon} className={styles.icon} aria-hidden="true" />
        ) : (
          <img src={warningIcon} className={styles.icon} aria-hidden="true" />
        )
      }
    >
      {isUserEmailVarified ? (
        <div
          data-test-id="verified-section"
          className={cn(styles.content, "d-flex flex-wrap align-content-around")}
        >
          <p className={cn(styles.text, "pt-2")}>Your email is verified. </p>
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
            You need to verify your email address, which will be used for your wallet link we send
            you
          </p>
          {isThereUnverifiedEmail && (
            <Col xs={12} className="d-flex justify-content-center" data-test-id="resend-link">
                <Button
                  layout="secondary"
                  iconPosition="icon-after"
                  svgIcon={arrowRight}
                  onClick={resendEmail}
                >
                  Resend Link
                </Button>
            </Col>
          )}
        </div>
      )}
    </PanelDark>
  );
};
export const VerifyEmailWidget = appConnect<IStateProps, IDispatchProps, {}>({
  stateToProps: s => ({
    isUserEmailVarified: selectIsUserEmailVerified(s.auth),
    isThereUnverifiedEmail: selectIsThereUnverifiedEmail(s.auth),
    email: selectVerifiedUserEmail(s.auth),
  }),
  dispatchToProps: dispatch => ({
    resendEmail: () => {
      dispatch(actions.settings.resendEmail());
    },
  }),
})(VerifyEmailWidgetComponent);
