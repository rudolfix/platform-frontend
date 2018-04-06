import * as React from "react";
import { Col, Row } from "reactstrap";
import { compose } from "redux";
import { actions } from "../modules/actions";
import { appConnect } from "../store";
import { LoadingIndicator } from "./shared/LoadingIndicator";

interface IEmailVerifyDispatchProps {
  verifyEmail: () => void;
}

export const emailVerifyComponent: React.SFC<IEmailVerifyDispatchProps> = ({ verifyEmail }) => {
  verifyEmail();
  return (
    <div>
      <LoadingIndicator />
    </div>
  );
};

export const emailVerify = compose<React.SFC>(
  appConnect<IEmailVerifyDispatchProps>({
    dispatchToProps: dispatch => ({
      verifyEmail: () => dispatch(actions.auth.verifyEmail()),
    }),
  }),
)(emailVerifyComponent);
