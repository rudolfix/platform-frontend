import { DeepReadonlyObject, ECurrency, ENumberInputFormat } from "@neufund/shared-utils";
import { compose, keyBy, reverse, sortBy } from "lodash/fp";

import {
  TAnalyticsTransaction,
  TAnalyticsTransactionTokenMetadata,
} from "./lib/http/analytics-api/interfaces";
import { EModuleStatus, ITxHistoryState } from "./reducer";
import { TTxHistory } from "./types";

// TODO: Try to sync backend currency format with frontend, as currently we use `eur_t` for nEur
const getCurrencyFromTokenSymbol = (
  metadata: TAnalyticsTransactionTokenMetadata | undefined,
): ECurrency => {
  if (!metadata) {
    return ECurrency.ETH;
  }

  switch (metadata.tokenSymbol) {
    case "nEUR":
      return ECurrency.EUR_TOKEN;
    case "NEU":
      return ECurrency.NEU;
    case "ETH":
      return ECurrency.ETH;
    default:
      throw new Error(`Token ${metadata.tokenSymbol} is not supported`);
  }
};

const getDecimalsFormat = (
  metadata: TAnalyticsTransactionTokenMetadata | undefined,
): ENumberInputFormat => {
  if (!metadata) {
    return ENumberInputFormat.ULPS;
  }

  switch (metadata.tokenDecimals) {
    case 0:
      return ENumberInputFormat.DECIMAL;
    case 18:
      return ENumberInputFormat.ULPS;
    default:
      throw new Error(`Unsupported token decimals ${metadata.tokenDecimals} received`);
  }
};

const getTxUniqueId = (transaction: TAnalyticsTransaction) =>
  `${transaction.blockNumber}_${transaction.transactionIndex}_${transaction.logIndex}`;

const convertTxHistoryNext = (
  processedTransactions: TTxHistory[],
  txHistoryState: DeepReadonlyObject<ITxHistoryState>,
  newLastTransactionId: string | undefined,
): ITxHistoryState => {
  if (
    txHistoryState.transactionsOrder === undefined ||
    txHistoryState.transactionsByHash === undefined
  ) {
    throw new Error("Invalid tx history module state");
  }

  return {
    ...txHistoryState,
    transactionsOrder: txHistoryState.transactionsOrder.concat(
      processedTransactions.map(tx => tx.id),
    ),
    transactionsByHash: {
      ...txHistoryState.transactionsByHash,
      ...keyBy(tx => tx.id, processedTransactions),
    },
    lastTransactionId: newLastTransactionId,
    status: EModuleStatus.IDLE,
  };
};

// TODO unit tests for this
const convertTxHistory = (
  processedTransactions: TTxHistory[],
  lastTransactionId: string | undefined,
  newTimestampOfLastChange: number | undefined,
): ITxHistoryState => ({
  transactionsOrder: processedTransactions.map(tx => tx.id),
  transactionsByHash: keyBy(tx => tx.id, processedTransactions),
  lastTransactionId: lastTransactionId,
  timestampOfLastChange: newTimestampOfLastChange,
  status: EModuleStatus.IDLE,
});

const mergeTxHistory = (
  txHistoryState: ITxHistoryState,
  newLastTransactionId: string | undefined,
  newTimestampOfLastChange: number | undefined,
  processedTransactions: TTxHistory[],
): ITxHistoryState => {
  const {
    transactionsOrder: currentTransactionsOrder = [],
    transactionsByHash: currentTransactionsByHash = {},
  } = txHistoryState;

  const newTransactionsIds = processedTransactions
    .filter(tx => !currentTransactionsByHash[tx.id])
    .map(tx => tx.id);

  const transactionsByHash = {
    ...currentTransactionsByHash,
    ...keyBy(tx => tx.id, processedTransactions),
  };

  // sort transactions by block number, transaction index and log index
  // there is an edge case where new transaction can appear between existing ones
  const transactionsOrder = compose(
    reverse,
    sortBy([
      tx => transactionsByHash[tx].blockNumber,
      tx => transactionsByHash[tx].transactionIndex,
      tx => transactionsByHash[tx].logIndex,
    ]),
  )(newTransactionsIds.concat(currentTransactionsOrder));

  return {
    transactionsOrder,
    transactionsByHash,
    lastTransactionId: newLastTransactionId,
    timestampOfLastChange: newTimestampOfLastChange,
    status: EModuleStatus.IDLE,
  };
};

export {
  getCurrencyFromTokenSymbol,
  getDecimalsFormat,
  getTxUniqueId,
  convertTxHistoryNext,
  mergeTxHistory,
  convertTxHistory,
};
