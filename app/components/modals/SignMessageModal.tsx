import * as React from "react";
import { Modal } from "reactstrap";
import { actions } from "../../modules/actions";
import { selectIsLightWallet, selectIsUnlocked } from "../../modules/web3/reducer";
import { appConnect } from "../../store";
import { ButtonSecondary } from "../shared/Buttons";
import { LoadingIndicator } from "../shared/LoadingIndicator";
import { LightWalletSignPrompt } from "./LightWalletSign";
import { ModalComponentBody } from "./ModalComponentBody";

interface IStateProps {
  isOpen: boolean;
  errorMsg?: string;
  isLightWallet: boolean;
  isUnlocked: boolean;
}

interface IDispatchProps {
  onCancel: () => void;
  onAccept: (password?: string) => void;
}

const GenericSignPrompt = ({ onCancel }: { onCancel: () => void }) => (
  <div>
    <h2>Sign message on your wallet</h2>
    <ButtonSecondary onClick={onCancel}>Cancel</ButtonSecondary>
  </div>
);

const MessageSignModalComponent: React.SFC<IStateProps & IDispatchProps> = props => (
  <Modal isOpen={props.isOpen} toggle={props.onCancel}>
    <ModalComponentBody onClose={props.onCancel}>
      {props.isLightWallet ? (
        <LightWalletSignPrompt {...props} />
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
    isUnlocked: selectIsUnlocked(s.web3State),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.signMessageModal.hide()),
    onAccept: (password?: string) => dispatch(actions.signMessageModal.accept(password)),
  }),
})(MessageSignModalComponent);
