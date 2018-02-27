import * as React from "react";
import { Button, Modal, ModalBody, ModalFooter, ModalHeader } from "reactstrap";

import { actions } from "../../modules/actions";
import { selectIsLightWallet } from "../../modules/web3/reducer";
import { appConnect } from "../../store";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { LightWalletSignPrompt } from "./LightWalletSign";

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
    <p>Confirm message on your signer!</p>
    <Button onClick={onCancel}>Reject</Button>
  </div>
);

const MessageSignModalComponent: React.SFC<IStateProps & IDispatchProps> = props => (
  <Modal isOpen={props.isOpen} toggle={props.onCancel}>
    <ModalHeader>Message Signing!</ModalHeader>
    <ModalBody>
      <h2>We need your password to unlock your wallet</h2>

      {props.isLightWallet ? (
        <LightWalletSignPrompt />
      ) : (
        <GenericSignPrompt onCancel={props.onCancel} />
      )}

      <p>{props.errorMsg}</p>
    </ModalBody>
    <ModalFooter>
      <LoadingIndicator />
    </ModalFooter>
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
