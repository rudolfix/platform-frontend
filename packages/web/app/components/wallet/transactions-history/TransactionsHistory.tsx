import { Button, EButtonLayout } from "@neufund/design-system";
import { txHistoryApi } from "@neufund/shared-modules";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";
import { branch, compose, renderComponent } from "recompose";

import { selectPlatformMiningTransaction } from "../../../modules/tx/monitor/selectors";
import { withContainer } from "../../shared/hocs/withContainer";
import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import { PanelRounded } from "../../shared/Panel";
import { PendingTransaction } from "./PendingTransaction";
import { Transaction } from "./Transaction";

import * as styles from "./TransactionsHistory.module.scss";

type TExternalProps = {
  transactionsHistoryPaginated: ReturnType<typeof txHistoryApi.selectors.selectTxHistoryPaginated>;
  pendingTransaction: ReturnType<typeof selectPlatformMiningTransaction>;
  loadTxHistoryNext: () => void;
  showTransactionDetails: (id: string) => void;
};

export const NoTransactions = () => (
  <div className={styles.noTransactions}>
    <FormattedMessage id="wallet.tx-list.no-transaction" />
  </div>
);

export const TransactionListLoading = () => (
  <LoadingIndicator className={styles.transactionListLoading} />
);

const TransactionListContainer: React.FunctionComponent = ({ children }) => (
  <PanelRounded>{children}</PanelRounded>
);

export const TransactionListLayout: React.FunctionComponent<TExternalProps> = ({
  transactionsHistoryPaginated,
  loadTxHistoryNext,
  pendingTransaction,
  showTransactionDetails,
}) => (
  <>
    {(transactionsHistoryPaginated.transactions || pendingTransaction) && (
      <ul className={styles.transactionList} data-test-id="transactions-history">
        {pendingTransaction && (
          <PendingTransaction
            data-test-id="pending-transactions.transaction-mining"
            transaction={pendingTransaction}
          />
        )}

        {transactionsHistoryPaginated.transactions &&
          transactionsHistoryPaginated.transactions.map(transaction => (
            <Transaction
              key={transaction.id}
              transaction={transaction}
              showTransactionDetails={showTransactionDetails}
            />
          ))}
      </ul>
    )}
    {transactionsHistoryPaginated.canLoadMore && (
      <Button
        data-test-id="transactions-history-load-more"
        layout={EButtonLayout.LINK}
        isLoading={transactionsHistoryPaginated.isLoading}
        onClick={loadTxHistoryNext}
      >
        <FormattedMessage id="wallet.tx-list.load-more" />
      </Button>
    )}
  </>
);

const TransactionsHistory = compose<TExternalProps, TExternalProps>(
  withContainer(TransactionListContainer),
  branch<TExternalProps>(
    props =>
      props.transactionsHistoryPaginated.transactions === undefined &&
      props.transactionsHistoryPaginated.isLoading,
    renderComponent(TransactionListLoading),
  ),
  branch<TExternalProps>(
    props =>
      props.transactionsHistoryPaginated.transactions !== undefined &&
      props.transactionsHistoryPaginated.transactions.length === 0 &&
      props.pendingTransaction === null,
    renderComponent(NoTransactions),
  ),
)(TransactionListLayout);

export { TransactionsHistory };
