import * as React from "react";
import { Modal } from "reactstrap";

import { Button } from "../../shared/Buttons";
import { ModalComponentBody } from "../ModalComponentBody";

import { appConnect } from "../../../store";
import { actions } from "../../../modules/actions";
import { TxSenderType, TxSenderState, ITxData } from "../../../modules/tx/sender/reducer";
import { selectTxSenderModalOpened } from "../../../modules/tx/sender/selectors";
import { TxData } from "web3";

interface IStateProps {
  isOpen: boolean;
  state: TxSenderState;
  type?: TxSenderType;
  details?: ITxData;
}

interface IDispatchProps {
  onCancel: () => any;
  confirm: (to: string, value: string) => any;
}

type Props = IStateProps & IDispatchProps;

export const TxSenderModalComponent: React.SFC<Props> = props => {
  const { isOpen, type, state, onCancel, confirm } = props;

  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalComponentBody onClose={onCancel}>
        <h2>Type: {type}</h2>
        <h2>State: {state}</h2>

        {renderBody(props)}
      </ModalComponentBody>
    </Modal>
  );
};

function renderBody({ state, confirm, details }: Props): React.ReactNode {
  switch (state) {
    case "INIT":
      return (
        <div>
          Here we need forms.<br />
          <Button
            onClick={() =>
              confirm("0x627d795782f653c8ea5e7a63b9cdfe5cb6846d9f", "1000000000000000")
            }
          >
            Confirm
          </Button>
        </div>
      );
    case "SUMMARY":
      return (
        <div>
          <h3>Details:</h3>To: {details!.to}
        </div>
      );
    // case ""
    // default: throw new Error(`Unrecognized tx sender state: ${state}`);
  }
}

export const TxSenderModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: selectTxSenderModalOpened(state.txSender),
    state: state.txSender.state,
    type: state.txSender.type,
    details: state.txSender.txDetails,
  }),
  dispatchToProps: d => ({
    onCancel: () => d(actions.txSender.txSenderHideModal()),
    confirm: (to: string, value: string) => d(actions.txSender.txSenderConfirm({ to, value })),
  }),
})(TxSenderModalComponent);
