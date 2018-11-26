import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ConfettiEthereum } from "../../../landing/parts/ConfettiEthereum";

import * as styles from "./Success.module.scss";

interface IProps {
  txHash: string;
}

export const WithdrawSuccess: React.SFC<IProps> = ({ txHash }) => (
  <div className="text-center" data-test-id="modals.tx-sender.withdraw-flow.success">
    <ConfettiEthereum className="mb-3" />
    <h3 className={styles.title}>
      <FormattedMessage id="withdraw-flow.success" />
    </h3>
    <div className={styles.explanation}>
      <FormattedMessage id="withdraw-flow.success-transaction-id" />
    </div>
    <div data-test-id="modals.tx-sender.withdraw-flow.tx-hash">
      <a href={`https://etherscan.io/address/${txHash}`} target="_blank">
        {txHash}
      </a>
    </div>
  </div>
);
