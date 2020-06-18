import * as React from "react";

import { TTranslatedString } from "../../../../../types";
import { EWarningAlertSize, WarningAlert } from "../../../../shared/WarningAlert";

import * as styles from "./WalletLedgerChooserError.module.scss";

type TWalletLedgerChooserErrorProps = {
  message: TTranslatedString;
};

export const WalletLedgerChooserError: React.FunctionComponent<TWalletLedgerChooserErrorProps> = ({
  message,
}) => (
  <div className={styles.wrapper}>
    <WarningAlert
      size={EWarningAlertSize.BIG}
      data-test-id="wallet-selector-session-timeout-notification"
    >
      {message}
    </WarningAlert>
  </div>
);
