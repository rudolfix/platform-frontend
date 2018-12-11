import * as React from "react";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { selectBackupCodesVerified } from "../../../modules/auth/selectors";
import { selectIsUnlocked, selectSeed } from "../../../modules/web3/selectors";
import { appConnect } from "../../../store";
import { createErrorBoundary } from "../../shared/errorBoundary/ErrorBoundary";
import { ErrorBoundaryLayoutAuthorized } from "../../shared/errorBoundary/ErrorBoundaryLayoutAuthorized";
import { LoadingIndicator } from "../../shared/loading-indicator";
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

interface IBackupSeedComponentState {
  seed?: string[];
}

class BackupSeedComponent extends React.Component<
  IDispatchProps & IStateProps,
  IBackupSeedComponentState
> {
  constructor(props: IDispatchProps & IStateProps) {
    super(props);
    this.state = {};
  }
  componentWillMount(): void {
    this.props.getSeed();
  }

  componentDidUpdate(): void {
    if (this.props.seed && !this.state.seed) this.setState({ seed: this.props.seed });
  }

  componentWillUnmount(): void {
    this.props.clearSeed();
  }

  render(): React.ReactNode {
    if (this.state.seed)
      return (
        <BackupSeedFlowContainer
          backupCodesVerified={this.props.backupCodesVerified}
          verifyBackupPhrase={this.props.verifyBackupPhrase}
          onCancel={this.props.onCancel}
          seed={this.state.seed}
        />
      );
    return <LoadingIndicator />;
  }
}

export const BackupSeed = compose<React.SFC>(
  createErrorBoundary(ErrorBoundaryLayoutAuthorized),
  appConnect<IStateProps, IDispatchProps>({
    stateToProps: s => ({
      isUnlocked: selectIsUnlocked(s.web3),
      seed: selectSeed(s.web3),
      backupCodesVerified: selectBackupCodesVerified(s),
    }),
    dispatchToProps: dispatch => ({
      verifyBackupPhrase: () => dispatch(actions.walletSelector.lightWalletBackedUp()),
      onCancel: () => dispatch(actions.routing.goToProfile()),
      getSeed: () => dispatch(actions.profile.loadSeedOrReturnToProfile()),
      clearSeed: () => dispatch(actions.web3.clearSeedFromState()),
    }),
  }),
)(BackupSeedComponent);
