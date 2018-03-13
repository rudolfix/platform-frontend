import * as cn from "classnames";
import * as React from "react";
import * as styles from "./VerifyEmailWidget.module.scss";

import { compose } from "redux";
import { appConnect } from "../../store";
import { ArrowLink } from "../shared/ArrowLink";
import { PanelDark } from "../shared/PanelDark";

export const VerifyEmailWidgetComponent: React.SFC<any> = props => {
  return (
    <PanelDark
      headerText="EMAIL VERIFICATION"
      className={cn(styles.widget, "bg-white w-100")}
      rightComponent={
        props.unverifiedEmail ? (
          <i className={"fa fa-lg fa-check-circle"} aria-hidden="true" />
        ) : (
          <i className={"fa fa-lg fa-exclamation-circle"} aria-hidden="true" />
        )
      }
    >
      {props.unverifiedEmail ? (
        <>
          <p className="mt-3 mb-5 ml-1 mr-1">Your email is verified. </p>
          <ArrowLink arrowDirection="right" to="#" className="mb-4 d-flex justify-content-center">
            Resend Link
          </ArrowLink>
        </>
      ) : (
        <>
          <p className="mt-3 mb-5 ml-1 mr-1">
            You need to verify your email address, which will be used for your wallet link we send
            you
          </p>
          <br />
          <ArrowLink arrowDirection="right" to="#" className="mb-4 d-flex justify-content-center">
            Verify
          </ArrowLink>
        </>
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
