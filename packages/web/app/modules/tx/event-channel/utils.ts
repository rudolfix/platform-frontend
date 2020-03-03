import * as Web3 from "web3";

const noBlockHeightDefault = 0;
const getBlockHeight = (): number =>
  process.env.BLOCK_MINING_HEIGHT
    ? parseInt(process.env.BLOCK_MINING_HEIGHT, 10)
    : noBlockHeightDefault;

const isTransactionMined = (
  tx: Web3.Transaction,
  txReceipt: Web3.TransactionReceipt | null,
  currentBlockNumber: number,
): boolean => {
  const blockHeight = getBlockHeight();
  /**
   * Check if transaction is mined given required block height
   * @note Both requests `getTx` and `getTransactionReceipt` can end up in two separate nodes that's why we need `tx` and `txReceipt`
   */

  const isMined =
    !!tx &&
    !!tx.blockNumber &&
    !!txReceipt &&
    !!txReceipt.blockNumber &&
    currentBlockNumber - tx.blockNumber >= blockHeight &&
    currentBlockNumber - txReceipt.blockNumber >= blockHeight;

  return isMined;
};

export { getBlockHeight, isTransactionMined };
