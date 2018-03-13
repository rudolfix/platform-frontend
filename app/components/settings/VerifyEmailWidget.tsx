import * as React from "react";

import { compose } from "redux";
import { appConnect } from "../../store";
import { ArrowLink } from "../shared/ArrowLink";
import { PanelDark } from "../shared/PanelDark";

export const VerifyEmailWidgetComponent: React.SFC<any> = props => {
  return (
    <PanelDark
      headerText="EMAIL VERIFICATION"
      className="bg-white w-100"
      rightComponent={
        props.unverifiedEmail ? (
          <i className={"fa fa-lg fa-check-circle"} aria-hidden="true" />
        ) : (
          <i className={"fa fa-lg fa-exclamation-circle"} aria-hidden="true" />
        )
      }
    >
      <p className="mt-3 mb-5 ml-1 mr-1">
        You need to verify your email address, which will be used for your wallet link we send you
      </p>
      <br />
      <ArrowLink arrowDirection="right" to="#" className="mb-4 d-flex justify-content-center">
        Verify
      </ArrowLink>
    </PanelDark>
  );
};

export const VerifyEmailWidget = compose<React.ComponentClass>(
  appConnect<any>({
    stateToProps: s => ({
      user: s.auth.user,
    }),
    options: { pure: false }, // we need this because of:https://github.com/ReactTraining/react-router/blob/master/packages/react-router/docs/guides/blocked-updates.md
  }),
)(VerifyEmailWidgetComponent);
