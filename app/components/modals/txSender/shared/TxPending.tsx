import * as React from "react";

import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";

import * as styles from "./TxPending.module.scss";

export interface ITxPendingProps {
  blockId: number;
  txHash: string;
}

export const TxPending: React.SFC<ITxPendingProps> = ({ blockId, txHash }) => (
  <div className="text-center">
    <SpinningEthereum className="mb-3" />

    <h3 className={styles.title}>Pending transaction</h3>

    <p>
      Your TX has been broadcast to the network and is waiting to be mined & confirmed. During ICOs,
      it may take 3+ hours to confirm. While this transaction is pending you will be blocked from
      making another transaction on the platform.
    </p>

    <a className={styles.txHash} href={`https://etherscan.io/tx/${txHash}`} target="_blank">
      TX Hash: {txHash}
    </a>

    <p>
      Block number: <span className={styles.blockId}>{blockId}</span>
    </p>
  </div>
);
