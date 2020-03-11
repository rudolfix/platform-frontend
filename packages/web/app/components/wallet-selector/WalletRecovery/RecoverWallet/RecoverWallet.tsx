import * as React from "react";
import { compose } from "recompose";

import { actions } from "../../../../modules/actions";
import { ERecoveryPhase } from "../../../../modules/wallet-selector/light-wizard/reducer";
import { selectLightWalletRecoveryPhase } from "../../../../modules/wallet-selector/light-wizard/selectors";
import { appConnect } from "../../../../store";
import { LightWalletRecoverySignUp } from "./LightWalletRecoverySignUp/LightWalletRecoverySignUp";
import { LightWalletRecoverySeedCheck } from "./RecoverWalletCheckSeed/RecoverWalletCheckSeed";

interface IDispatchProps {
  goToDashboard: () => void;
}

interface IMainRecoveryProps {
  // For testing purposes
  seed?: string;
  submitSeed: (seed: string) => void;
}

interface IMainRecoveryState {
  seed?: string;
}

class RecoveryProcessesComponent extends React.Component<
  IMainRecoveryProps & IDispatchProps & IStateProps,
  IMainRecoveryState
> {
  constructor(props: IMainRecoveryProps & IDispatchProps) {
    super(props);
    this.state = { seed: props.seed };
  }

  onValidSeed = (words: string): void => {
    this.setState({ seed: words });
    this.props.submitSeed(words);
  };

  render(): React.ReactNode {
    const { goToDashboard } = this.props;
    return (
      <>
        {this.state.seed && this.props.recoveryPhase === ERecoveryPhase.FORM_ENTRY_COMPONENT ? (
          <LightWalletRecoverySignUp goToDashboard={goToDashboard} seed={this.state.seed} />
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

interface IStateProps {
  recoveryPhase: ERecoveryPhase;
}

const RecoverWallet = compose<IMainRecoveryProps & IDispatchProps, {}>(
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: state => ({ recoveryPhase: selectLightWalletRecoveryPhase(state) }),
    dispatchToProps: dispatch => ({
      goToDashboard: () => dispatch(actions.routing.goToDashboard()),
      submitSeed: (seed: string) => dispatch(actions.walletSelector.submitSeed(seed)),
    }),
  }),
)(RecoveryProcessesComponent);

export { RecoverWallet, RecoveryProcessesComponent };
