import * as React from "react";
import { Modal } from "reactstrap";
import * as lockIcon from "../../assets/img/wallet_selector/lock_icon.svg";
import { actions } from "../../modules/actions";
import { selectIsLightWallet, selectIsUnlocked } from "../../modules/web3/reducer";
import { appConnect } from "../../store";
import { Button } from "../shared/Buttons";
import { AccessLightWalletPrompt } from "./AccessLightWalletPrompt";
import { ModalComponentBody } from "./ModalComponentBody";

interface IStateProps {
  isOpen: boolean;
  errorMsg?: string;
  title?: string;
  message?: string;
  isLightWallet: boolean;
  isUnlocked: boolean;
}

interface IDispatchProps {
  onCancel: () => void;
  onAccept: (password?: string) => void;
}

const GenericSignPrompt = ({ onCancel }: { onCancel: () => void }) => (
  <div className="text-md-center">
    <Button onClick={onCancel}>Cancel</Button>
  </div>
);

const AccessWalletModalComponent: React.SFC<IStateProps & IDispatchProps> = props => (
  <Modal isOpen={props.isOpen} toggle={props.onCancel}>
    <ModalComponentBody onClose={props.onCancel}>
      <div className="text-md-center">
        <h1>{props.title}</h1>
        <p>{props.message}</p>
        <img src={lockIcon} className="mb-3" />
        {props.isLightWallet ? (
          <AccessLightWalletPrompt {...props} />
        ) : (
          <GenericSignPrompt onCancel={props.onCancel} />
        )}
        <p>{props.errorMsg}</p>
      </div>
    </ModalComponentBody>
  </Modal>
);

export const AccessWalletModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: s => ({
    isOpen: s.accessWallet.isModalOpen,
    errorMsg: s.accessWallet.modalErrorMsg,
    title: s.accessWallet.modalTitle,
    message: s.accessWallet.modalMessage,
    isLightWallet: selectIsLightWallet(s.web3),
    isUnlocked: selectIsUnlocked(s.web3),
  }),
  dispatchToProps: dispatch => ({
    onCancel: () => dispatch(actions.signMessageModal.hideAccessWalletModal()),
    onAccept: (password?: string) => dispatch(actions.signMessageModal.accept(password)),
  }),
})(AccessWalletModalComponent);
