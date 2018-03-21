import * as React from "react";
import { Modal } from "reactstrap";
import { actions } from "../../modules/actions";
import { selectIsLightWallet } from "../../modules/web3/reducer";
import { appConnect } from "../../store";
import { Button } from "../shared/Buttons";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { LightWalletSignPrompt } from "./LightWalletSign";
import { ModalComponentBody } from "./ModalComponentBody";

interface IStateProps {
  isOpen: boolean;
  errorMsg?: string;
  isLightWallet: boolean;
}

interface IDispatchProps {
  onCancel: () => void;
}

const GenericSignPrompt = ({ onCancel }: { onCancel: () => void }) => (
  <div>
    <h2>Sign message on your wallet</h2>
    <Button layout="secondary" onClick={onCancel}>
      Cancel
    </Button>
  </div>
);

const MessageSignModalComponent: React.SFC<IStateProps & IDispatchProps> = props => (
  <Modal isOpen={props.isOpen} toggle={props.onCancel}>
    <ModalComponentBody onClose={props.onCancel}>
      {props.isLightWallet ? (
        <LightWalletSignPrompt />
      ) : (
        <GenericSignPrompt onCancel={props.onCancel} />
      )}

      <p>{props.errorMsg}</p>
      <LoadingIndicator />
    </ModalComponentBody>
  </Modal>
);

export const MessageSignModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: s.signMessageModal.isOpen,
    errorMsg: s.signMessageModal.errorMsg,
    isLightWallet: selectIsLightWallet(s.web3State),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.signMessageModal.hide()),
  }),
})(MessageSignModalComponent);
