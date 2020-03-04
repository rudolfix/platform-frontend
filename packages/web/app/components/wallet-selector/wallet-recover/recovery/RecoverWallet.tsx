import * as React from "react";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { selectIsMessageSigning } from "../../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../../store";
import { WalletMessageSigner } from "../../WalletMessageSigner/WalletMessageSigner";
import { IRecoveryFormValues, LightWalletRecoverySignUp } from "./LightWalletRecoverySignUp";
import { LightWalletRecoverySeedCheck } from "./RecoverWalletCheckSeed";

interface IDispatchProps {
  submitForm: (values: IRecoveryFormValues, seed: string) => void;
  goToDashboard: () => void;
}

interface IStateProps {
  isMessageSigning: boolean;
}

interface IMainRecoveryProps {
  // For testing purposes
  seed?: string;
}

interface IMainRecoveryState {
  seed?: string;
}

class RecoveryProcessesComponent extends React.Component<
  IMainRecoveryProps & IDispatchProps,
  IMainRecoveryState
> {
  constructor(props: IMainRecoveryProps & IDispatchProps) {
    super(props);
    this.state = { seed: props.seed };
  }

  onValidSeed = (words: string): void => {
    this.setState({ seed: words });
  };

  render(): React.ReactNode {
    const { goToDashboard, submitForm } = this.props;
    return (
      <>
        {this.state.seed ? (
          <LightWalletRecoverySignUp
            goToDashboard={goToDashboard}
            submitForm={submitForm}
            seed={this.state.seed}
          />
        ) : (
          <LightWalletRecoverySeedCheck
            goToDashboard={goToDashboard}
            onValidSeed={this.onValidSeed}
          />
        )}
      </>
    );
  }
}

const RecoverWallet = compose<IMainRecoveryProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      isMessageSigning: selectIsMessageSigning(s),
    }),
    dispatchToProps: dispatch => ({
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
      submitForm: (values: IRecoveryFormValues, seed: string) => {
        dispatch(actions.walletSelector.lightWalletRecover(values.email, values.password, seed));
      },
    }),
  }),
  branch<IStateProps>(
    props => props.isMessageSigning,
    renderComponent(() => <WalletMessageSigner rootPath={"/"} />),
  ),
)(RecoveryProcessesComponent);

export { RecoverWallet, RecoveryProcessesComponent };
