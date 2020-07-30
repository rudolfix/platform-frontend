import { InlineIcon } from "@neufund/design-system";
import { ETransactionDirection, TTxHistory } from "@neufund/shared-modules";
import {
  assertNever,
  ECurrency,
  ENumberOutputFormat,
  makeTid,
  TDataTestId,
} from "@neufund/shared-utils";
import * as React from "react";
import { FormattedDate } from "react-intl";

import { ETheme, Money } from "../../shared/formatters/Money";
import { useButtonRole } from "../../shared/hooks/useButtonRole";
import { EInlineIconFill } from "../../shared/icons";
import { TransactionName } from "../../shared/transaction";

import incomingTransactionIcon from "../../../assets/img/inline_icons/tx_in.svg";
import outgoingTransactionIcon from "../../../assets/img/inline_icons/tx_out.svg";
import * as styles from "./TransactionsHistory.module.scss";

export type TTransactionProps = {
  showTransactionDetails: (id: string) => void;
  transaction: TTxHistory;
};

type TTransactionLogoProps = {
  transactionDirection: ETransactionDirection;
};

const TransactionLogo: React.FunctionComponent<TTransactionLogoProps> = ({
  transactionDirection,
}) => {
  switch (transactionDirection) {
    case ETransactionDirection.IN:
      return (
        <div className={styles.transactionLogoWrapper}>
          <InlineIcon
            svgIcon={incomingTransactionIcon}
            fill={EInlineIconFill.FILL_OUTLINE}
            className={styles.transactionLogo}
          />
        </div>
      );
    case ETransactionDirection.OUT:
      return (
        <div className={styles.transactionLogoWrapper}>
          <InlineIcon
            svgIcon={outgoingTransactionIcon}
            fill={EInlineIconFill.FILL_OUTLINE}
            className={styles.transactionLogo}
          />
        </div>
      );
    default:
      assertNever(transactionDirection, "invalid transaction direction");
  }
};

export const Transaction: React.FunctionComponent<TTransactionProps & TDataTestId> = ({
  showTransactionDetails,
  transaction,
  "data-test-id": dataTestId,
}) => {
  const isIncomeTransaction = transaction.transactionDirection === ETransactionDirection.IN;
  const clickableRowProps = useButtonRole(() => showTransactionDetails(transaction.id));
  return (
    <li
      className={styles.transactionListItem}
      key={transaction.id}
      data-test-id={`transactions-history-row transactions-history-${transaction.txHash.slice(
        0,
        10,
      )}`}
      {...clickableRowProps}
    >
      <TransactionLogo transactionDirection={transaction.transactionDirection} />
      <div className={styles.transactionData}>
        <span
          className={styles.transactionDataTitle}
          data-test-id={makeTid(dataTestId, "large-value")}
        >
          <TransactionName transaction={transaction} />
        </span>
        <span className={styles.transactionDataDate} data-test-id={makeTid(dataTestId, "value")}>
          <FormattedDate value={transaction.date} year="numeric" month="long" day="2-digit" />
        </span>
      </div>
      <div className={styles.transactionAmount}>
        <span className={styles.amount}>
          {!isIncomeTransaction && "-"}
          <Money
            inputFormat={transaction.amountFormat}
            outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
            theme={isIncomeTransaction ? ETheme.GREEN : undefined}
            value={transaction.amount}
            valueType={transaction.currency}
          />
        </span>
        {"amountEur" in transaction && (
          <span className={styles.euroEquivalent}>
            {"≈"}
            <Money
              inputFormat={transaction.amountFormat}
              outputFormat={ENumberOutputFormat.ONLY_NONZERO_DECIMALS}
              value={transaction.amountEur}
              valueType={ECurrency.EUR}
            />
          </span>
        )}
      </div>
    </li>
  );
};
