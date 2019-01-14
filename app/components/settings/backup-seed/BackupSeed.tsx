import * as React from "react";
import { compose } from "redux";

import { actions } from "../../../modules/actions";
import { selectBackupCodesVerified } from "../../../modules/auth/selectors";
import { IWalletPrivateData } from "../../../modules/web3/reducer";
import { selectIsUnlocked, selectWalletPrivateData } from "../../../modules/web3/selectors";
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
  walletPrivateData?: IWalletPrivateData;
  isUnlocked: boolean;
  backupCodesVerified: boolean;
}

interface IBackupSeedComponentState {
  walletPrivateData?: IWalletPrivateData;
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
    if (this.props.walletPrivateData && !this.state.walletPrivateData)
      this.setState({ walletPrivateData: this.props.walletPrivateData });
  }

  componentWillUnmount(): void {
    this.props.clearSeed();
  }

  render(): React.ReactNode {
    if (this.state.walletPrivateData)
      return (
        <BackupSeedFlowContainer
          backupCodesVerified={this.props.backupCodesVerified}
          verifyBackupPhrase={this.props.verifyBackupPhrase}
          onCancel={this.props.onCancel}
          walletPrivateData={this.state.walletPrivateData}
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
      walletPrivateData: selectWalletPrivateData(s.web3),
      backupCodesVerified: selectBackupCodesVerified(s),
    }),
    dispatchToProps: dispatch => ({
      verifyBackupPhrase: () => dispatch(actions.walletSelector.lightWalletBackedUp()),
      onCancel: () => dispatch(actions.routing.goToProfile()),
      getSeed: () => dispatch(actions.profile.loadSeedOrReturnToProfile()),
      clearSeed: () => dispatch(actions.web3.clearWalletPrivateDataFromState()),
    }),
  }),
)(BackupSeedComponent);
