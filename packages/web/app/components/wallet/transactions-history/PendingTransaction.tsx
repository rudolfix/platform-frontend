import { InlineIcon } from "@neufund/design-system";
import { ETxType } from "@neufund/shared-modules";
import { ENumberOutputFormat, makeTid } from "@neufund/shared-utils";
import cn from "classnames";
import * as React from "react";
import { FormattedDate } from "react-intl";
import { FormattedMessage } from "react-intl-phraseapp";

import { TxPendingWithMetadata } from "../../../lib/api/users-tx/interfaces";
import { TDataTestId } from "../../../types";
import { Money } from "../../shared/formatters/Money";
import { EInlineIconFill } from "../../shared/icons";
import { TransactionName } from "../../shared/transaction";

import txPending from "../../../assets/img/inline_icons/tx_pending.svg";
import * as styles from "./TransactionsHistory.module.scss";

const PendingTransactionLabel = () => (
  <span className={styles.pendingTransactionLabel}>
    <FormattedMessage id="modals.shared.tx-status-label.pending" />
  </span>
);

type TPendingTransactionProps = {
  transaction: TxPendingWithMetadata;
};

const TransactionLogo: React.FunctionComponent = () => (
  <div className={styles.transactionLogoWrapper}>
    <InlineIcon
      svgIcon={txPending}
      fill={EInlineIconFill.FILL_OUTLINE}
      className={cn(styles.transactionLogo, styles.pendingTransactionLogo)}
    />
  </div>
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
          <TransactionLogo />
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
          <TransactionLogo />
          <div className={styles.transactionData}>
            <span
              className={styles.transactionDataTitle}
              data-test-id={makeTid(dataTestId, "large-value")}
            >
              <TransactionName transaction={transaction.transactionAdditionalData} />
            </span>
            <span
              className={styles.transactionDataDate}
              data-test-id={makeTid(dataTestId, "value")}
            >
              <FormattedDate
                value={transaction.transactionTimestamp}
                year="numeric"
                month="long"
                day="2-digit"
              />
              <PendingTransactionLabel />
            </span>
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
