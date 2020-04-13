import * as React from "react";

import { CounterLayout } from "../../../shared/Counter";
import { IncomingPayoutPendingBase } from "./IncomingPayoutPending";

import * as styles from "./PayoutWidget.module.scss";

type TExternalProps = {
  etherTokenIncomingPayout: string;
  euroTokenIncomingPayout: string;
};

export const IncomingPayoutWaitingLayout: React.FunctionComponent<TExternalProps> = ({
  etherTokenIncomingPayout,
  euroTokenIncomingPayout,
}) => (
  <IncomingPayoutPendingBase
    data-test-id="my-portfolio-widget-incoming-payout-waiting"
    etherTokenIncomingPayout={etherTokenIncomingPayout}
    euroTokenIncomingPayout={euroTokenIncomingPayout}
  >
    <CounterLayout
      data-test-id="incoming-payout-counter"
      className={styles.counterWidget}
      timeLeft={0}
      blink={true}
    />
  </IncomingPayoutPendingBase>
);
