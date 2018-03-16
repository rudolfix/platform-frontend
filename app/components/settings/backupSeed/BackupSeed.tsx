import * as Mnemonic from "bitcore-mnemonic";
import * as React from "react";

import { actions } from "../../../modules/actions";
import { appConnect } from "../../../store";
import { appRoutes } from "../../AppRouter";
import { BackupSeedDisplay } from "./BackupSeedDisplay";
import { BackupSeedIntro } from "./BackupSeedIntro";
import { BackupSeedVerify } from "./BackupSeedVerify";

const words = Mnemonic.Words.ENGLISH.slice(0, 24); // TODO: get real words

interface IStateProps {
  words: string[];
}

interface IDispatchProps {
  verifyBackupPhrase: () => void;
}

interface IComponentState {
  backupStep: number;
}

class BackupSeedContainer extends React.Component<IStateProps & IDispatchProps, IComponentState> {
  constructor(props: IStateProps & IDispatchProps) {
    super(props);

    this.state = {
      backupStep: 1,
    };
  }

  onBack = () => {
    this.setState({
      backupStep: this.state.backupStep - 1,
    });
  };

  onNext = () => {
    this.setState({
      backupStep: this.state.backupStep + 1,
    });
  };

  render(): React.ReactNode {
    switch (this.state.backupStep) {
      case 1:
        return <BackupSeedIntro onBack={appRoutes.settings} onNext={this.onNext} />;
      case 2:
        return (
          <BackupSeedDisplay onBack={this.onBack} onNext={this.onNext} words={this.props.words} />
        );
      default:
        return (
          <BackupSeedVerify
            onBack={this.onBack}
            onNext={this.props.verifyBackupPhrase}
            words={this.props.words}
          />
        );
    }
  }
}

export const BackupSeed = appConnect<IStateProps, IDispatchProps>({
  stateToProps: _s => ({
    words: words,
  }),
  dispatchToProps: dispatch => ({
    verifyBackupPhrase: () => {
      dispatch(actions.wallet.lightWalletBackedUp());
    },
  }),
})(BackupSeedContainer);
