import { ENumberOutputFormat } from "@neufund/shared-utils";
import * as cn from "classnames";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { TxPendingWithMetadata } from "../../../lib/api/users-tx/interfaces";
import { ETxType } from "../../../lib/web3/types";
import { TDataTestId } from "../../../types";
import { Money } from "../../shared/formatters/Money";
import { TransactionData, TransactionName } from "../../shared/transaction";

import txPending from "../../../assets/img/Pending.svg";
import * as styles from "./TransactionsHistory.module.scss";

const PendingTransactionLabel = () => (
  <div className={styles.pendingTransactionLabel}>
    <FormattedMessage id="modals.shared.tx-status-label.pending" />
  </div>
);

type TPendingTransactionProps = {
  transaction: TxPendingWithMetadata;
};

const PendingTransactionIcon = () => (
  <img src={txPending} className={styles.pendingTransactionIcon} alt="" />
);

export const PendingTransaction: React.FunctionComponent<TPendingTransactionProps &
  TDataTestId> = ({ transaction, "data-test-id": dataTestId }) => {
  switch (transaction.transactionType) {
    case ETxType.NOMINEE_THA_SIGN:
      return (
        <ul
          className={cn(styles.transactionListItem, styles.pendingTransactionItem)}
          data-test-id={dataTestId}
        >
          <div className={styles.transactionLogo}>
            <PendingTransactionIcon />
          </div>
          <div className={styles.transactionData}>
            <FormattedMessage id="wallet.tx-list.name.nominee-sign-tha" />
            <PendingTransactionLabel />
          </div>
          <div className={styles.transactionAmount} />
        </ul>
      );
    default:
      return (
        <ul
          className={cn(styles.transactionListItem, styles.pendingTransactionItem)}
          data-test-id={dataTestId}
        >
          <div className={styles.transactionLogo}>
            <PendingTransactionIcon />
          </div>
          <div className={styles.transactionData}>
            <TransactionData
              top={<TransactionName transaction={transaction.transactionAdditionalData} />}
              bottom={
                <FormattedDate
                  value={transaction.transactionTimestamp}
                  year="numeric"
                  month="long"
                  day="2-digit"
                />
              }
            />
            <PendingTransactionLabel />
          </div>
          <div className={styles.transactionAmount}>
            <Money
              className={cn(styles.amount)}
              decimals={transaction.transactionAdditionalData.tokenDecimals}
              inputFormat={transaction.transactionAdditionalData.amountFormat}
              outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              value={transaction.transactionAdditionalData.amount}
              valueType={transaction.transactionAdditionalData.currency}
            />
          </div>
        </ul>
      );
  }
};
