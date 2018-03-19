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
    this.props.fetchSeed();
    this.state = {
      pageNo: 0,
    };
  }

  componentDidUpdate(): void {
    if (!this.props.isOpen) this.props.clearSeed();
  }

  render(): React.ReactNode {
    return this.props.seed ? (
      <BackupSeedDisplayComponent totalSteps={2} startingStep={1} words={this.props.seed} isModal />
    ) : (
      <LoadingIndicator />
    );
  }
}

const Test: React.SFC<any> = props => {
  return props.isUnlocked ? (
    <Modal isOpen={props.isOpen} toggle={props.onCancel}>
      <ViewSeedModalComponent {...props} />
    </Modal>
  ) : (
    <Modal isOpen={props.isOpen} toggle={props.onCancel}>
      <ModalComponentBody onClose={props.onCancel}>
        <LightWalletSignPrompt onAccept={props.onAccept} onCancel={props.onCancel} />
        <p>{props.errorMsg}</p>
      </ModalComponentBody>
    </Modal>
  );
};

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
})(Test);
