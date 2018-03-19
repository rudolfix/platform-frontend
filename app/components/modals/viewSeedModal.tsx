import * as React from "react";
import { Modal } from "reactstrap";
import { actions } from "../../modules/actions";
import { selectIsLightWallet, selectIsUnlocked, selectSeed } from "../../modules/web3/reducer";
import { appConnect } from "../../store";
import { BackupSeedDisplayComponent } from "../settings/backupSeed/BackupSeedDisplay";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { LightWalletSignPrompt } from "./LightWalletSign";
import { ModalComponentBody } from "./ModalComponentBody";

interface IStateProps {
  isOpen: boolean;
  errorMsg?: string;
  isLightWallet: boolean;
  isUnlocked: boolean;
  seed?: string[];
}

interface IDispatchProps {
  onCancel: () => void;
  onAccept: (password?: string) => void;
  fetchSeed: () => void;
  clearSeed: () => void;
}

interface IState {
  pageNo: number;
  seed?: string[];
}

export class ViewSeedModalComponent extends React.Component<IStateProps & IDispatchProps, IState> {
  constructor(props: any) {
    super(props);

    this.state = {
      pageNo: 0,
    };
  }

  componentDidUpdate(): void {
    if (this.props.isOpen && this.props.isUnlocked && !this.props.seed) this.props.fetchSeed();
    if (!this.props.isOpen && this.props.seed) this.props.clearSeed();
    if (this.props.seed && !this.state.seed) {
      this.setState({ ...this.state, seed: this.props.seed });
    }
  }

  render(): React.ReactNode {
    const { isOpen, isUnlocked, seed, onCancel, isLightWallet, errorMsg } = this.props;

    return this.state.seed ? (
      <Modal isOpen={isOpen} toggle={onCancel}>
        <BackupSeedDisplayComponent
          totalSteps={2}
          startingStep={1}
          words={seed!}
          isModal
          onNext={() => {}}
          onBack={() => {}}
        />
      </Modal>
    ) : (
      <Modal isOpen={isOpen} toggle={onCancel}>
        <ModalComponentBody onClose={onCancel}>
          {isLightWallet && !isUnlocked ? <LightWalletSignPrompt {...this.props} /> : <></>}
          <p>{errorMsg}</p>
          <LoadingIndicator />
        </ModalComponentBody>
      </Modal>
    );
  }
}
export const ViewSeedModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: s.showSeedModal.isOpen,
    errorMsg: s.showSeedModal.errorMsg,
    isLightWallet: selectIsLightWallet(s.web3State),
    isUnlocked: selectIsUnlocked(s.web3State),
    seed: selectSeed(s.web3State),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.showSeedModal.seedModelhide()),
    onAccept: (password?: string) => dispatch(actions.showSeedModal.seedModelAccept(password)),
    fetchSeed: () => dispatch(actions.web3.fetchSeedFromWallet()),
    clearSeed: () => dispatch(actions.web3.clearSeedFromState()),
  }),
})(ViewSeedModalComponent);
