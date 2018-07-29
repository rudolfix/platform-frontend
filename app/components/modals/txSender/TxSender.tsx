import * as React from "react";
import { Modal } from "reactstrap";

import { InvestmentSelection } from "../../dashboard/investment-flow/Investment";
import { Button } from "../../shared/Buttons";
import { ModalComponentBody } from "../ModalComponentBody";
import { AccessWalletContainer } from "../walletAccess/AccessWalletModal";

import { actions } from "../../../modules/actions";
import { ITxData, TxSenderState, TxSenderType } from "../../../modules/tx/sender/reducer";
import { selectTxSenderModalOpened } from "../../../modules/tx/sender/selectors";
import { appConnect } from "../../../store";
import { LoadingIndicator } from "../../shared/LoadingIndicator";

interface IStateProps {
  isOpen: boolean;
  state: TxSenderState;
  type?: TxSenderType;
  details?: ITxData;
  blockId?: number;
}

interface IDispatchProps {
  onCancel: () => any;
  acceptDraft: (tx: Partial<ITxData>) => any;
  accept: () => any;
}

type Props = IStateProps & IDispatchProps;

export const TxSenderModalComponent: React.SFC<Props> = props => {
  const { isOpen, onCancel } = props;

  return (
    <Modal isOpen={isOpen} toggle={onCancel}>
      <ModalComponentBody onClose={onCancel}>{renderBody(props)}</ModalComponentBody>
    </Modal>
  );
};

export interface IInitComponentProps {
  onAccept: (tx: Partial<ITxData>) => any;
}

function renderBody({ state, acceptDraft, accept, details, blockId }: Props): React.ReactNode {
  switch (state) {
    case "INIT":
      return (
        <div>
          <InvestmentSelection onAccept={acceptDraft} />
        </div>
      );
    case "SUMMARY":
      return (
        <div>
          <h3>Tx details:</h3>
          <p>{JSON.stringify(details)}</p>

          <Button onClick={() => accept()}>Confirm</Button>
        </div>
      );
    case "ACCESSING_WALLET":
      return (
        <div>
          <AccessWalletContainer />
        </div>
      );

    case "SIGNING":
      return <LoadingIndicator />;

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
    acceptDraft: (tx: Partial<ITxData>) => d(actions.txSender.txSenderAcceptDraft(tx)),
    accept: () => d(actions.txSender.txSenderAccept()),
  }),
})(TxSenderModalComponent);
