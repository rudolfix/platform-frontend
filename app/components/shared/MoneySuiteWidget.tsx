import * as React from "react";
import { makeTid } from "../../utils/tidUtils";
import { Money, selectCurrencySymbol, TCurrency } from "./Money";
import * as styles from "./MoneySuiteWidget.module.scss";

interface IMoneySuiteWidgetProps {
  icon: string;
  currency: TCurrency;
  currencyTotal: TCurrency;
  largeNumber: string;
  value: string;
  percentage?: string;
  "data-test-id"?: string;
}

export const MoneySuiteWidget: React.SFC<
  IMoneySuiteWidgetProps & React.HTMLAttributes<HTMLDivElement>
> = ({
  icon,
  currency,
  currencyTotal,
  largeNumber,
  value,
  percentage,
  "data-test-id": dataTestId,
}) => (
  <>
    <div className={styles.moneySuiteWidget}>
      <img className={styles.icon} src={icon} />
      <div>
        <div className={styles.money} data-test-id={makeTid(dataTestId, "-large-value")}>
          <span className={styles.currency}>{selectCurrencySymbol(currency)}</span>
          <Money value={largeNumber} currency={currency} noCurrencySymbol />
        </div>
        <div className={styles.totalMoney} data-test-id={makeTid(dataTestId, "-value")}>
          = <Money value={value} currency={currencyTotal} />
          {percentage && (
            <span className={`${parseInt(percentage, 10) > 0 ? styles.green : styles.red}`}>
              {" "}
              ({percentage}%)
            </span>
          )}
        </div>
      </div>
    </div>
  </>
);
