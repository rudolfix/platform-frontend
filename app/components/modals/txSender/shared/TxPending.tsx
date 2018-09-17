import * as React from "react";

import { SpinningEthereum } from "../../../landing/parts/SpinningEthereum";

import { FormattedMessage } from "react-intl-phraseapp";
import * as styles from "./TxPending.module.scss";

export interface ITxPendingProps {
  blockId: number;
  txHash: string;
}

export const TxPending: React.SFC<ITxPendingProps> = ({ blockId, txHash }) => (
  <div className="text-center" test-data-id="modals.shared.tx-pending.modal">
    <SpinningEthereum className="mb-3" />

    <h3 className={styles.title}>
      <FormattedMessage id="tx-sender.tx-pending.title" />
    </h3>

    <p>
      <FormattedMessage id="tx-sender.tx-pending.description" />
    </p>

    <a className={styles.txHash} href={`https://etherscan.io/tx/${txHash}`} target="_blank">
      <FormattedMessage id="tx-sender.tx-pending.hash-label" /> {txHash}
    </a>

    <p>
      <FormattedMessage id="tx-sender.tx-pending.block-number-label" />
      <span className={styles.blockId}>{blockId}</span>
    </p>
  </div>
);
