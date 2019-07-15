import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, renderComponent } from "recompose";

import { TxPendingWithMetadata } from "../../../lib/api/users/interfaces";
import { ETxSenderState } from "../../../modules/tx/sender/reducer";
import { ActionRequired, EActionRequiredPosition } from "../../shared/ActionRequired";
import { Button, EButtonLayout } from "../../shared/buttons/index";
import { TooltipBase } from "../../shared/tooltips/index";

import * as bellNotification from "../../../assets/img/bell-notification.svg";
import * as bell from "../../../assets/img/bell.svg";

interface IExternalProps {
  pendingTransaction?: Pick<TxPendingWithMetadata, "transactionStatus">;
  monitorPendingTransaction: () => void;
  className: string;
}

const NoPendingTransactionImage = () => <img src={bell} width="20px" alt="" />;
const PendingTransactionImage = () => <img src={bellNotification} width="20px" alt="" />;

const PendingTransactionStatusLayout: React.FunctionComponent<Required<IExternalProps>> = ({
  pendingTransaction,
  monitorPendingTransaction,
}) => {
  switch (pendingTransaction.transactionStatus) {
    case ETxSenderState.MINING:
      return (
        <>
          <Button
            data-test-id="pending-transactions-status.mining"
            layout={EButtonLayout.SIMPLE}
            onClick={monitorPendingTransaction}
            className="mr-3"
          >
            <PendingTransactionImage />
          </Button>
        </>
      );

    case ETxSenderState.DONE:
      return (
        <Button
          data-test-id="pending-transactions-status.success"
          layout={EButtonLayout.SIMPLE}
          onClick={monitorPendingTransaction}
        >
          <NoPendingTransactionImage />
        </Button>
      );

    case ETxSenderState.ERROR_SIGN:
      return (
        <Button
          data-test-id="pending-transactions-status.error"
          layout={EButtonLayout.SIMPLE}
          onClick={monitorPendingTransaction}
        >
          <ActionRequired active={true} position={EActionRequiredPosition.TOP}>
            <NoPendingTransactionImage />
          </ActionRequired>
        </Button>
      );

    default:
      throw new Error(
        `Unsupported pending transaction status: ${pendingTransaction.transactionStatus}`,
      );
  }
};

const NoPendingTransaction: React.FunctionComponent<{ className: string }> = ({ className }) => (
  <>
    <div
      className={className}
      id="no-pending-transactions"
      data-test-id="pending-transactions-status.no-pending-transactions"
    >
      <NoPendingTransactionImage />
    </div>

    <TooltipBase target="no-pending-transactions" hideArrow={true}>
      <p className="mb-0">
        <FormattedMessage id="pending-transaction-status.no-pending-transactions.tooltip" />
      </p>
    </TooltipBase>
  </>
);

const PendingTransactionStatus = branch<IExternalProps>(
  props => !props.pendingTransaction || !props.pendingTransaction.transactionStatus,
  renderComponent(NoPendingTransaction),
)(PendingTransactionStatusLayout);

export { PendingTransactionStatus };
