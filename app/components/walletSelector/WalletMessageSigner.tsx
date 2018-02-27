import * as React from "react";
import { compose } from "redux";

import { actions } from "../../modules/actions";
import { appConnect } from "../../store";
import { ButtonPrimary } from "../shared/Buttons";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { MessageSignPrompt } from "../signing/MessageSignPrompt";

interface IStateProps {
  errorMsg?: string;
}

interface IDispatchProps {
  cancelSigning: () => void;
}

export const MessageSignerComponent: React.SFC<IStateProps & IDispatchProps> = ({
  errorMsg,
  cancelSigning,
}) => (
  <>
    <MessageSignPrompt />
    {errorMsg ? <p>{errorMsg}</p> : <LoadingIndicator />}
    <ButtonPrimary onClick={cancelSigning}>Cancel</ButtonPrimary>
  </>
);

export const WalletMessageSigner = compose(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({
      errorMsg: state.walletSelector.messageSigningError,
    }),
    dispatchToProps: dispatch => ({
      cancelSigning: () => {
        dispatch(actions.wallet.reset());
        dispatch(actions.routing.goToRegister());
      },
    }),
  }),
)(MessageSignerComponent);
