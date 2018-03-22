import * as React from "react";

import { Col, Modal, Row } from "reactstrap";
import { actions } from "../../../modules/actions";
import { selectIsUnlocked, selectSeed } from "../../../modules/web3/reducer";
import { appConnect } from "../../../store";
import { LightWalletSignPrompt } from "../../modals/LightWalletSign";

import * as cn from "classnames";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import * as styles from "./BackupSeed.module.scss";
import { BackupSeedFlowContainer } from "./BackupSeedFlowContainer";

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

class BackupSeedComponent extends React.Component<IDispatchProps & IStateProps> {
  componentWillUnmount(): void {
    this.props.clearSeed();
  }

  renderUnlockedWalletComponent(): React.ReactNode {
    if (this.props.seed)
      return (
        <BackupSeedFlowContainer
          verifyBackupPhrase={this.props.verifyBackupPhrase}
          onCancel={this.props.onCancel}
          seed={this.props.seed}
        />
      );
    this.props.fetchSeed();
    return <LoadingIndicator />;
  }

  renderLockedWalletComponent(): React.ReactNode {
    return (
      <>
        <Modal isOpen={true} toggle={this.props.onCancel}>
          <Row className="justify-content-center">
            <Col xs={4} className={cn(styles.content, "d-flex align-items-center")}>
              <Row>
                <Col xs={12}>
                  <LightWalletSignPrompt
                    onAccept={this.props.onAccept}
                    onCancel={this.props.onCancel}
                    isUnlocked={this.props.isUnlocked}
                  />
                </Col>
                <Col xs={12}>
                  <p>{this.props.errorMsg}</p>
                </Col>
              </Row>
            </Col>
          </Row>
        </Modal>
        {/* This is done only for visuals */}
        <BackupSeedFlowContainer
          verifyBackupPhrase={this.props.onCancel}
          onCancel={this.props.onCancel}
          seed={[]}
        />
      </>
    );
  }

  render(): React.ReactNode {
    return this.props.isUnlocked
      ? this.renderUnlockedWalletComponent()
      : this.renderLockedWalletComponent();
  }
}

export const BackupSeed = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isUnlocked: selectIsUnlocked(s.web3State),
    seed: selectSeed(s.web3State),
    errorMsg: s.showSeedModal.errorMsg,
  }),
  dispatchToProps: dispatch => ({
    verifyBackupPhrase: () => dispatch(actions.walletSelector.lightWalletBackedUp()),
    onAccept: (password?: string) => dispatch(actions.showSeedModal.seedModelAccept(password)),
    onCancel: () => dispatch(actions.routing.goToSettings()),
    fetchSeed: () => dispatch(actions.web3.fetchSeedFromWallet()),
    clearSeed: () => dispatch(actions.web3.clearSeedFromState()),
  }),
})(BackupSeedComponent);
