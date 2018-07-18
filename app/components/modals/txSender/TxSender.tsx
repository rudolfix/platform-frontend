import * as React from "react";
import { Modal } from "reactstrap";

import { Button } from "../../shared/Buttons";
import { ModalComponentBody } from "../ModalComponentBody";

import { TxData } from "web3";
import { actions } from "../../../modules/actions";
import { ITxData, TxSenderState, TxSenderType } from "../../../modules/tx/sender/reducer";
import { selectTxSenderModalOpened } from "../../../modules/tx/sender/selectors";
import { appConnect } from "../../../store";

interface IStateProps {
  isOpen: boolean;
  state: TxSenderState;
  type?: TxSenderType;
  details?: ITxData;
  blockId?: number;
}

interface IDispatchProps {
  onCancel: () => any;
  acceptDraft: (to: string, value: string) => any;
  accept: () => any;
}

type Props = IStateProps & IDispatchProps;

export const TxSenderModalComponent: React.SFC<Props> = props => {
  const { isOpen, type, state, onCancel, acceptDraft } = props;

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

function renderBody({ state, acceptDraft, accept, details, blockId }: Props): React.ReactNode {
  switch (state) {
    case "INIT":
      return (
        <div>
          Here we need forms.<br />
          <Button
            onClick={() =>
              acceptDraft("0x627d795782f653c8ea5e7a63b9cdfe5cb6846d9f", "1000000000000000")
            }
          >
            NEXT
          </Button>
        </div>
      );
    case "SUMMARY":
      return (
        <div>
          <h3>Details:</h3>To: {details!.to}
          <Button onClick={() => accept()}>Confirm</Button>
        </div>
      );
    case "MINING":
      return <div>{blockId}</div>;
  }
}

export const TxSenderModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: selectTxSenderModalOpened(state.txSender),
    state: state.txSender.state,
    type: state.txSender.type,
    details: state.txSender.txDetails,
    blockId: state.txSender.blockId,
  }),
  dispatchToProps: d => ({
    onCancel: () => d(actions.txSender.txSenderHideModal()),
    acceptDraft: (to: string, value: string) =>
      d(actions.txSender.txSenderAcceptDraft({ to, value })),
    accept: () => d(actions.txSender.txSenderAccept()),
  }),
})(TxSenderModalComponent);
