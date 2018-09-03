import * as cn from "classnames"
import * as React from "react";
import { Modal } from "reactstrap";

import { actions } from "../../../modules/actions";
import { ITxData, TxSenderState, TxSenderType } from "../../../modules/tx/sender/reducer";
import { selectTxSenderModalOpened } from "../../../modules/tx/sender/selectors";
import { appConnect } from "../../../store";
import { ModalComponentBody } from "../ModalComponentBody";
import { AccessWalletContainer } from "../walletAccess/AccessWalletModal";
import { InvestmentSelection } from "./investment-flow/Investment";
import { InvestmentSummary } from "./investment-flow/Summary";
import { SigningMessage } from "./shared/SigningMessage";
import { TxPending } from "./shared/TxPending";
import { WatchPendingTxs } from "./shared/WatchPeningTxs";
import { WithdrawSuccess } from "./withdraw-flow/Success";
import { WithdrawSummary } from "./withdraw-flow/Summary";
import { Withdraw } from "./withdraw-flow/Withdraw";

interface IStateProps {
  isOpen: boolean;
  state: TxSenderState;
  type?: TxSenderType;
  details?: ITxData;
  blockId?: number;
  txHash?: string;
}

interface IDispatchProps {
  onCancel: () => any;
}

type Props = IStateProps & IDispatchProps;

function isBigModal (props: Props): boolean {
  return props.state === "INIT" && props.type === "INVEST"
}

export const TxSenderModalComponent: React.SFC<Props> = props => {
  const { isOpen, onCancel } = props;

  return (
    <Modal isOpen={isOpen} toggle={onCancel} className={cn(isBigModal(props) && "big")}>
      <ModalComponentBody onClose={onCancel}>{renderBody(props)}</ModalComponentBody>
    </Modal>
  );
};

export interface ITxInitDispatchProps {
  onAccept: (tx: Partial<ITxData>) => any;
}

export interface ITxSummaryStateProps {
  txData: ITxData;
}
export interface ITxSummaryDispatchProps {
  onAccept: () => any;
}
export type TSummaryComponentProps = ITxSummaryStateProps & ITxSummaryDispatchProps

function getInitComponent (type: TxSenderType): JSX.Element {
  switch (type) {
    case "INVEST":
      return <InvestmentSelection />
    case "WITHDRAW":
      return <Withdraw />
  }
}

function getSummaryComponent (type: TxSenderType): JSX.Element {
  switch (type) {
    case "INVEST":
      return <InvestmentSummary />
    case "WITHDRAW":
      return <WithdrawSummary />
  }
}

function renderBody({
  state,
  blockId,
  txHash,
  type
}: Props): React.ReactNode {
  switch (state) {
    case "WATCHING_PENDING_TXS":
      return <WatchPendingTxs />;

    case "INIT":
      return getInitComponent(type!)

    case "SUMMARY":
      return getSummaryComponent(type!)

    case "ACCESSING_WALLET":
      return <AccessWalletContainer />;

    case "SIGNING":
      return <SigningMessage />;

    case "MINING":
      return <TxPending blockId={blockId!} txHash={txHash!} />;

    case "DONE":
      return <WithdrawSuccess />;

    case "ERROR_SIGN":
      return <div>Error occured!!!!</div>;

    case "REVERTED":
      return <div>Error: Tx reverted!</div>;
  }
}

export const TxSenderModal = appConnect<IStateProps, IDispatchProps>({
  stateToProps: state => ({
    isOpen: selectTxSenderModalOpened(state.txSender),
    state: state.txSender.state,
    type: state.txSender.type!,
    txHash: state.txSender.txHash,
    blockId: state.txSender.blockId,
  }),
  dispatchToProps: d => ({
    onCancel: () => d(actions.txSender.txSenderHideModal()),
  })
})(TxSenderModalComponent);
