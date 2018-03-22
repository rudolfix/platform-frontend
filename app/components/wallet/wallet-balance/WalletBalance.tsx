import * as React from "react";
import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";
import { ButtonSecondary } from "../../shared/Buttons";
import { ChartDoughnut } from "../../shared/charts/ChartDoughnut";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";
import { IPanelDarkProps, PanelDark } from "../../shared/PanelDark";
import { TotalEuro } from "../TotalEuro";
import * as styles from "./WalletBalance.module.scss";

export enum WalletBalanceTheme {
  light = "t-light",
  dark = "t-dark",
}

interface IWalletBalance {
  totalEurValue: string;
  theme: WalletBalanceTheme;
  moneyValueOne: number;
  moneyValueTwo: number;
  chartData: any;
}

export const WalletBalance: React.SFC<IPanelDarkProps & IWalletBalance> = ({
  moneyValueOne,
  moneyValueTwo,
  chartData,
  headerText,
  totalEurValue,
  theme,
}) => (
  <div className={`${styles.walletBalance} ${theme}`}>
    <PanelDark headerText={headerText} rightComponent={<TotalEuro totalEurValue={totalEurValue} />}>
      <div className={styles.walletBalanceWrapper}>
        <div className={styles.chartWrapper}>
          <ChartDoughnut data={chartData} />
        </div>
        <div className={`${styles.walletBalanceActions}`}>
          <div className={styles.moneySuiteWrapper}>
            <MoneySuiteWidget
              currency="eur_token"
              largeNumber={`${moneyValueOne}`}
              icon={moneyIcon}
              data-test-id="euro-widget"
              value={`6004904646${"0".repeat(16)}`}
              percentage={"0"}
              currencyTotal={"eur"}
            />
            <div className={styles.buttonsWrapper}>
              <ButtonSecondary>Withdraw funds ></ButtonSecondary>
              <ButtonSecondary>Deposit funds ></ButtonSecondary>
            </div>
          </div>
          <div className={styles.moneySuiteWrapper}>
            <MoneySuiteWidget
              currency="eth"
              largeNumber={`${moneyValueTwo}`}
              icon={ethIcon}
              data-test-id="euro-widget"
              value={"6004904646" + "0".repeat(16)}
              percentage={"-500"}
              currencyTotal={"eur"}
            />
            <div className={styles.buttonsWrapper}>
              <ButtonSecondary>Withdraw funds ></ButtonSecondary>
              <ButtonSecondary>Deposit funds ></ButtonSecondary>
            </div>
          </div>
        </div>
      </div>
    </PanelDark>
  </div>
);
