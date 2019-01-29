import * as cn from "classnames";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { ECurrency, Money } from "./Money";
import { MoneySuiteWidget, TSize, TTheme } from "./MoneySuiteWidget";

import * as styles from "./AssetPortfolio.module.scss";
import { NewTable, NewTableRow } from "./NewTable";

interface IProps {
  icon: string;
  currency: ECurrency;
  currencyTotal: ECurrency;
  largeNumber: string;
  value: string;
  moneyValue: string;
  tokenValue: string;
  tokenChange: number;
  moneyChange: number;
  theme?: TTheme;
  size?: TSize;
}

export const AssetPortfolio: React.FunctionComponent<IProps> = props => {
  return (
    <div className={styles.assetPortfolio}>
      <div className={styles.yourNeumark}>
        <h3 className={styles.title}>
          <FormattedMessage id="shared-components.asset-portfolio.title" />
        </h3>
        <MoneySuiteWidget
          icon={props.icon}
          currency={props.currency}
          currencyTotal={props.currencyTotal}
          largeNumber={props.largeNumber}
          value={props.value}
          theme="light"
          size="large"
        />
      </div>
      <div className={styles.listing}>
        <div className={styles.eur}>
          <Money value={props.moneyValue} currency={ECurrency.EUR} />
          <span className={cn(props.moneyChange < 0 ? styles.red : styles.green, "ml-2")}>
            ({props.moneyChange}
            %)
          </span>
        </div>
        <div className={styles.className}>
          <Money value={props.tokenValue} currency={ECurrency.ETH} />
          <span className={cn(props.tokenChange < 0 ? styles.red : styles.green, "ml-2")}>
            ({props.tokenChange}
            %)
          </span>
        </div>
      </div>
      <NewTable
        keepRhythm
        titles={[
          <FormattedMessage id="shared-component.asset-portfolio.market-cap" />,
          <FormattedMessage id="shared-component.asset-portfolio.circulating-supply" />,
          <FormattedMessage id="shared-component.asset-portfolio.total-supply" />,
          <FormattedMessage id="shared-component.asset-portfolio.max-supply" />,
          <FormattedMessage id="shared-component.asset-portfolio.volume-24h" />,
        ]}
      >
        <NewTableRow>
          <span>market cap</span>
          <span>circulating supply</span>
          <span>total supply</span>
          <span>max supply</span>
          <span>volume supply</span>
        </NewTableRow>
      </NewTable>
    </div>
  );
};
