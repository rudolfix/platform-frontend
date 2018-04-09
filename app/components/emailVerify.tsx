import * as React from "react";
import { Container } from "reactstrap";
import { actions } from "../modules/actions";
import { selectIsUserEmailVerified } from "../modules/auth/selectors";
import { appConnect } from "../store";
import { LoadingIndicator } from "./shared/LoadingIndicator";

interface IEmailVerifyDispatchProps {
  verifyEmail: () => void;
  goHome: () => void;
}

interface IEmailVerifyStateProps {
  isVerified?: boolean;
}

export const emailVerifyComponent: React.SFC<
  IEmailVerifyDispatchProps & IEmailVerifyStateProps
> = ({ verifyEmail, isVerified, goHome }) => {
  if (isVerified) {
    goHome();
  } else {
    verifyEmail();
  }
  return (
    <Container>
      <LoadingIndicator />
    </Container>
  );
};

export const emailVerify = appConnect<IEmailVerifyStateProps, IEmailVerifyDispatchProps>({
  stateToProps: s => ({
    isVerified: selectIsUserEmailVerified(s.auth),
  }),
  dispatchToProps: dispatch => ({
    verifyEmail: () => dispatch(actions.auth.verifyEmail()),
    goHome: () => dispatch(actions.routing.goHome()),
  }),
})(emailVerifyComponent);
