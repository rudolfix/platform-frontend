import * as React from "react";
import { Container } from "reactstrap";
import { actions } from "../modules/actions";
import { selectVerifiedUserEmail } from "../modules/auth/selectors";
import { selectLightWalletEmailFromQueryString } from "../modules/web3/reducer";
import { appConnect } from "../store";
import { LoadingIndicator } from "./shared/LoadingIndicator";

interface IEmailVerifyDispatchProps {
  verifyEmail: () => void;
  goHome: () => void;
}

interface IEmailVerifyStateProps {
  urlEmail?: string;
  verifiedEmail?: string;
}

export const emailVerifyComponent: React.SFC<
  IEmailVerifyDispatchProps & IEmailVerifyStateProps
> = ({ verifyEmail, urlEmail, verifiedEmail, goHome }) => {
  if (urlEmail === verifiedEmail) {
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
    urlEmail: selectLightWalletEmailFromQueryString(s.router),
    verifiedEmail: selectVerifiedUserEmail(s.auth),
  }),
  dispatchToProps: dispatch => ({
    verifyEmail: () => dispatch(actions.auth.verifyEmail()),
    goHome: () => dispatch(actions.routing.goHome()),
  }),
})(emailVerifyComponent);
