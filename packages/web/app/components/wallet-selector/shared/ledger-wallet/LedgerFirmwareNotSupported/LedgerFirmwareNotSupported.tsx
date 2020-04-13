import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { minimumLedgerVersion } from "../../../../../lib/web3/ledger-wallet/ledgerUtils";

import * as styles from "./LedgerFirmwareNotSupported.module.scss";

export const LedgerFirmwareNotSupported: React.FunctionComponent<{}> = () => (
  <div className={cn(styles.step, "mx-md-5")}>
    <p className="mx-n4">
      <FormattedMessage
        values={{ minimumVersion: minimumLedgerVersion }}
        id="wallet-selector.ledger.please-upgrade"
      />
    </p>
  </div>
);
