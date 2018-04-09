import * as cn from "classnames";
import * as React from "react";
import * as styles from "./VerifyEmailWidget.module.scss";

import * as arrowRight from "../../../assets/img/inline_icons/arrow_right.svg";
import * as successIcon from "../../../assets/img/notfications/Success_small.svg";
import * as warningIcon from "../../../assets/img/notfications/warning.svg";

import { Link } from "react-router-dom";
import { Col } from "reactstrap";
import { compose } from "redux";
import {
  selectIsThereUnverifiedEmail,
  selectIsUserEmailVerified,
} from "../../../modules/auth/selectors";
import { appConnect } from "../../../store";
import { Button } from "../../shared/Buttons";
import { PanelDark } from "../../shared/PanelDark";

interface IStateProps {
  isUserEmailVarified?: boolean;
  isThereUnverifiedEmail?: Boolean;
}

export const VerifyEmailWidgetComponent: React.SFC<IStateProps> = ({
  isUserEmailVarified,
  isThereUnverifiedEmail,
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
              <Link to="#">
                <Button layout="secondary" iconPosition="icon-after" svgIcon={arrowRight}>
                  Resend Link
                </Button>
              </Link>
            </Col>
          )}
        </div>
      )}
    </PanelDark>
  );
};
export const VerifyEmailWidget = compose<React.ComponentClass>(
  appConnect<IStateProps>({
    stateToProps: s => ({
      isUserEmailVarified: selectIsUserEmailVerified(s.auth),
      isThereUnverifiedEmail: selectIsThereUnverifiedEmail(s.auth),
    }),
  }),
)(VerifyEmailWidgetComponent);
