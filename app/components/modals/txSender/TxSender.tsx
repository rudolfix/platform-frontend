import * as React from "react";
import { Modal } from "reactstrap";

import { actions } from "../../../modules/actions";
import { ITxData, TxSenderState, TxSenderType } from "../../../modules/tx/sender/reducer";
import { selectTxSenderModalOpened } from "../../../modules/tx/sender/selectors";
import { appConnect } from "../../../store";
import { SpinningEthereum } from "../../landing/parts/SpinningEthereum";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { ModalComponentBody } from "../ModalComponentBody";
import { AccessWalletContainer } from "../walletAccess/AccessWalletModal";
import { WithdrawSummary } from "./withdraw-flow/Summary";
import { Withdraw } from "./withdraw-flow/Withdraw";

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

export interface ISummaryComponentProps {
  onAccept: () => any;
  data: ITxData;
}

function renderBody({ state, acceptDraft, accept, blockId, details }: Props): React.ReactNode {
  switch (state) {
    case "INIT":
      return <Withdraw onAccept={acceptDraft} />;

    case "SUMMARY":
      return <WithdrawSummary data={details!} onAccept={accept} />;

    case "ACCESSING_WALLET":
      return <AccessWalletContainer />;

    case "SIGNING":
      return <LoadingIndicator />;

    case "MINING":
      return <div>{blockId}</div>;

    case "DONE":
      return (
        <div>
          <SpinningEthereum />
          <h2>Done!</h2>
        </div>
      );

    case "ERROR_SIGN":
      return <div>Error occured!</div>;

    case "REVERTED":
      return <div>Error: Tx reverted!</div>;
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
