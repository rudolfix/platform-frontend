import * as React from "react";
import { branch, compose, renderComponent } from "recompose";

import { actions } from "../../../../modules/actions";
import { selectIsMessageSigning } from "../../../../modules/wallet-selector/selectors";
import { appConnect } from "../../../../store";
import { WalletMessageSigner } from "../../WalletMessageSigner/WalletMessageSigner";
import { LightWalletRecoverySignUp } from "./LightWalletRecoverySignUp";
import { LightWalletRecoverySeedCheck } from "./RecoverWalletCheckSeed";

interface IDispatchProps {
  goToDashboard: () => void;
}

interface IStateProps {
  isMessageSigning: boolean;
}

interface IMainRecoveryProps {
  // For testing purposes
  seed?: string;
  submitSeed: (seed:string) => void;
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
    this.props.submitSeed(words)
  };

  render(): React.ReactNode {
    const { goToDashboard } = this.props;
    return (
      <>
        {this.state.seed ? (
          <LightWalletRecoverySignUp
            goToDashboard={goToDashboard}
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
      submitSeed: (seed:string) => dispatch(actions.walletSelector.submitSeed(seed))
    }),
  }),
  branch<IStateProps>(
    props => props.isMessageSigning,
    renderComponent(() => <WalletMessageSigner rootPath={"/"} />),
  ),
)(RecoveryProcessesComponent);

export { RecoverWallet, RecoveryProcessesComponent };
