import * as React from "react";
import { Modal } from "reactstrap";

import { ModalComponentBody } from "../ModalComponentBody";

import { appConnect } from "../../../store";
import { actions } from "../../../modules/actions";
import { TxSenderType } from "../../../modules/tx/sender/reducer";

interface IStateProps {
  isOpen: boolean;
  type?: TxSenderType;
}

interface IDispatchProps {
  onCancel: () => any;
}

export const TxSenderModalComponent: React.SFC<IStateProps & IDispatchProps> = ({
  isOpen,
  type,
  onCancel,
}) => {
  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalComponentBody onClose={onCancel}>
        <h1>Type: {type}</h1>
      </ModalComponentBody>
    </Modal>
  );
};

export const TxSenderModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: state.txSender.modalIsOpen,
    type: state.txSender.type,
  }),
  dispatchToProps: d => ({
    onCancel: () => d(actions.txSender.txSenderHideModal()),
  }),
})(TxSenderModalComponent);
