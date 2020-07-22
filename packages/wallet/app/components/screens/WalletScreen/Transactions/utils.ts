import { TTransaction } from "./types";

const getTxUniqueId = (transaction: TTransaction) =>
  `${transaction.blockNumber}_${transaction.transactionIndex}_${transaction.logIndex}`;

export { getTxUniqueId };
