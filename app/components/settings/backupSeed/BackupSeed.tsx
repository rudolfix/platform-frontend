import * as React from "react";

import { actions } from "../../../modules/actions";
import { selectIsUnlocked, selectSeed } from "../../../modules/web3/reducer";
import { appConnect } from "../../../store";

import { selectBackupCodesVerified } from "../../../modules/auth/reducer";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { BackupSeedFlowContainer } from "./BackupSeedFlowContainer";

interface IDispatchProps {
  verifyBackupPhrase: () => void;
  onCancel: () => void;
  clearSeed: () => void;
  getSeed: () => void;
}

interface IStateProps {
  seed?: string[];
  isUnlocked: boolean;
  backupCodesVerified: boolean;
}

class BackupSeedComponent extends React.Component<IDispatchProps & IStateProps> {
  componentWillMount(): void {
    this.props.getSeed();
  }

  componentWillUnmount(): void {
    this.props.clearSeed();
  }

  render(): React.ReactNode {
    if (this.props.seed)
      return (
        <BackupSeedFlowContainer
          backupCodesVerified={this.props.backupCodesVerified}
          verifyBackupPhrase={this.props.verifyBackupPhrase}
          onCancel={this.props.onCancel}
          seed={this.props.seed}
        />
      );
    return <LoadingIndicator />;
  }
}

export const BackupSeed = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isUnlocked: selectIsUnlocked(s.web3),
    seed: selectSeed(s.web3),
    backupCodesVerified: !!selectBackupCodesVerified(s.auth),
  }),
  dispatchToProps: dispatch => ({
    verifyBackupPhrase: () => dispatch(actions.walletSelector.lightWalletBackedUp()),
    onCancel: () => dispatch(actions.routing.goToSettings()),
    getSeed: () => dispatch(actions.settings.loadSeedOrReturnToSettings()),
    clearSeed: () => dispatch(actions.web3.clearSeedFromState()),
  }),
})(BackupSeedComponent);
