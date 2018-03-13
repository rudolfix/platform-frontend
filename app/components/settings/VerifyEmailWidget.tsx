import * as cn from "classnames";
import * as React from "react";
import * as styles from "./VerifyEmailWidget.module.scss";

import { compose } from "redux";
import { IUser } from "../../lib/api/users/interfaces";
import { appConnect } from "../../store";
import { ArrowLink } from "../shared/ArrowLink";
import { PanelDark } from "../shared/PanelDark";

export const VerifyEmailWidgetComponent: React.SFC<IUser> = ({ verifiedEmail }) => {
  return (
    <PanelDark
      headerText="EMAIL VERIFICATION"
      className={cn(styles.widget, "bg-white w-100")}
      rightComponent={
        verifiedEmail ? (
          <i className={cn(styles.check, "fa fa-5 fa-check-circle ")} aria-hidden="true" />
        ) : (
          <i
            className={cn(styles.exclamation, "fa fa-5 fa-exclamation-circle")}
            aria-hidden="true"
          />
        )
      }
    >
      {verifiedEmail ? (
        <div data-test-id="verified-section">
          <p className="mt-3 mb-5 ml-1 mr-1">Your email is verified. </p>
          <ArrowLink arrowDirection="right" to="#" className="mb-4 d-flex justify-content-center">
            Resend Link
          </ArrowLink>
        </div>
      ) : (
        <div data-test-id="unverified-section">
          <p className="mt-3 mb-5 ml-1 mr-1">
            You need to verify your email address, which will be used for your wallet link we send
            you
          </p>
          <br />
          <ArrowLink arrowDirection="right" to="#" className="mb-4 d-flex justify-content-center">
            Verify
          </ArrowLink>
        </div>
      )}
    </PanelDark>
  );
};

export const VerifyEmailWidget = compose<React.ComponentClass>(
  appConnect<any>({
    stateToProps: s => ({
      user: s.auth.user,
    }),
  }),
)(VerifyEmailWidgetComponent);

//TODO: Change ICON backgrounds
