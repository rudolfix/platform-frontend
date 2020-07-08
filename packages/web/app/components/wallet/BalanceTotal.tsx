import { Eur } from "@neufund/design-system";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import * as styles from "./Wallet.module.scss";

type TCommonBalanceProps = {
  totalBalanceEuro: string;
};

export const BalanceTotal: React.FunctionComponent<TCommonBalanceProps> = ({
  totalBalanceEuro,
}) => (
  <>
    <div className={styles.totalBalanceTitle}>
      <FormattedMessage id="wallet.total-balance" />
    </div>
    <span className={styles.totalBalance}>
      €
      <Eur noSymbol value={totalBalanceEuro} />
    </span>
  </>
);
