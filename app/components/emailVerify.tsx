import * as React from "react";
import { Container } from "reactstrap";
import { actions } from "../modules/actions";
import { appConnect } from "../store";
import { LoadingIndicator } from "./shared/LoadingIndicator";

interface IEmailVerifyDispatchProps {
  verifyEmail: () => void;
}

export const emailVerifyComponent: React.SFC<IEmailVerifyDispatchProps> = ({ verifyEmail }) => {
  verifyEmail();
  return (
    <Container>
      <LoadingIndicator />
    </Container>
  );
};

export const emailVerify = appConnect<IEmailVerifyDispatchProps>({
  dispatchToProps: dispatch => ({
    verifyEmail: () => dispatch(actions.auth.verifyEmail()),
  }),
})(emailVerifyComponent);
