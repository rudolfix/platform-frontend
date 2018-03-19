import * as React from "react";

import { Col, Modal, Row } from "reactstrap";
import { actions } from "../../../modules/actions";
import { selectIsUnlocked, selectSeed } from "../../../modules/web3/reducer";
import { appConnect } from "../../../store";
import { appRoutes } from "../../AppRouter";
import { LightWalletSignPrompt } from "../../modals/LightWalletSign";
import { BackupSeedDisplay } from "./BackupSeedDisplay";
import { BackupSeedIntro } from "./BackupSeedIntro";
import { BackupSeedVerify } from "./BackupSeedVerify";

import * as cn from "classnames";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import * as styles from "./BackupSeed.module.scss";

interface IComponentDisptachProps {
  verifyBackupPhrase: () => void;
}

interface IComponentProps {
  seed: string[];
}

interface IComponentState {
  backupStep: number;
}

class BackupSeedContainerComponent extends React.Component<
  IComponentDisptachProps & IComponentProps,
  IComponentState
> {
  constructor(props: IComponentProps & IComponentDisptachProps) {
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
          <BackupSeedDisplay
            totalSteps={4}
            startingStep={2}
            onBack={this.onBack}
            onNext={this.onNext}
            words={this.props.seed}
          />
        );
      default:
        return (
          <BackupSeedVerify
            onBack={this.onBack}
            onNext={this.props.verifyBackupPhrase}
            words={this.props.seed}
          />
        );
    }
  }
}

interface IDispatchProps {
  verifyBackupPhrase: () => void;
  onAccept: (password?: string) => void;
  onCancel: () => void;
  fetchSeed: () => void;
  clearSeed: () => void;
}

interface IStateProps {
  seed?: string[];
  isUnlocked: boolean;
  errorMsg?: string;
}

interface IBackupSeedContainerState {
  seed: string[];
}
class BackupSeedContainer extends React.Component<
  IDispatchProps & IStateProps,
  IBackupSeedContainerState
> {
  constructor(props: IDispatchProps & IStateProps) {
    super(props);
  }
  componentWillUnmount(): void {
    this.props.clearSeed();
  }
  unlockedWalletComponent(): React.ReactNode {
    if (this.props.seed)
      return (
        <BackupSeedContainerComponent
          verifyBackupPhrase={this.props.verifyBackupPhrase}
          seed={this.props.seed}
        />
      );
    this.props.fetchSeed();
    return <LoadingIndicator />;
  }

  lockedWalletComponent = (): React.ReactNode => (
    <>
      <Modal isOpen={true} toggle={this.props.onCancel}>
        <Row className="justify-content-center">
          <Col xs={4} className={cn(styles.content, "d-flex align-items-center")}>
            <Row>
              <Col xs={12}>
                <LightWalletSignPrompt
                  onAccept={this.props.onAccept}
                  onCancel={this.props.onCancel}
                />
              </Col>
              <Col xs={12}>
                <p>{this.props.errorMsg}</p>
              </Col>
            </Row>
          </Col>
        </Row>
      </Modal>
      <BackupSeedIntro onBack={appRoutes.settings} onNext={() => {}} />
    </>
  );

  render(): React.ReactNode {
    return this.props.isUnlocked ? (
      <>{this.unlockedWalletComponent()}</>
    ) : (
      <>{this.lockedWalletComponent()}</>
    );
  }
}

export const BackupSeed = appConnect<{}, IDispatchProps>({
  stateToProps: s => ({
    isUnlocked: selectIsUnlocked(s.web3State),
    seed: selectSeed(s.web3State),
    errorMsg: s.showSeedModal.errorMsg,
  }),
  dispatchToProps: dispatch => ({
    verifyBackupPhrase: () => {
      dispatch(actions.wallet.lightWalletBackedUp());
    },
    onAccept: (password?: string) => dispatch(actions.showSeedModal.seedModelAccept(password)),
    onCancel: () => dispatch(actions.routing.goToSettings()),
    fetchSeed: () => dispatch(actions.web3.fetchSeedFromWallet()),
    clearSeed: () => dispatch(actions.web3.clearSeedFromState()),
  }),
})(BackupSeedContainer);
