import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { Q18 } from "../../../config/constants";
import { CommonHtmlProps } from "../../../types";
import { Button } from "../../shared/Buttons";
import { ChartDoughnut } from "../../shared/charts/ChartDoughnut";
import { LoadingIndicator } from "../../shared/LoadingIndicator";
import { MoneySuiteWidget } from "../../shared/MoneySuiteWidget";
import { IPanelDarkProps, PanelDark } from "../../shared/PanelDark";
import { TotalEuro } from "../TotalEuro";

import * as ethIcon from "../../../assets/img/eth_icon.svg";
import * as moneyIcon from "../../../assets/img/nEUR_icon.svg";
import * as styles from "./WalletBalance.module.scss";

export type TWalletBalance = "light" | "dark";

export interface IWalletValues {
  euroTokenAmount: string;
  euroTokenEuroAmount: string;
  ethAmount: string;
  ethEuroAmount: string;
  totalEuroAmount: string;
}

interface IWalletBalance {
  depositEuroTokenFunds: () => void;
  depositEthFunds: () => void;
  theme?: TWalletBalance;
  isLoading: boolean;
  data?: IWalletValues;
  isLocked: boolean;
}

const computeChartDataForTokens = (euroValues: string[]) => {
  const simplifiedValues = euroValues
    .map(s => new BigNumber(s))
    .map(b => b.div(Q18))
    .map(b => b.round(2).toNumber());

  return {
    labels: ["ETH", "nEUR"],
    datasets: [
      {
        data: simplifiedValues,
        backgroundColor: ["#e3eaf5", "#394651"],
      },
    ],
  };
};

export const WalletBalance: React.SFC<IPanelDarkProps & IWalletBalance & CommonHtmlProps> = ({
  isLocked,
  data,
  isLoading,
  headerText,
  depositEuroTokenFunds,
  depositEthFunds,
  className,
  style,
  theme = "light",
}) => (
  <PanelDark
    className={cn(className, styles.walletBalance, `t-${theme}`)}
    style={style}
    headerText={headerText}
    rightComponent={data && <TotalEuro totalEurValue={data.totalEuroAmount} />}
  >
    {isLoading ? (
      <LoadingIndicator />
    ) : (
      <div className={styles.walletBalanceWrapper}>
        <div className={styles.chartWrapper}>
          <ChartDoughnut
            data={computeChartDataForTokens([data!.ethEuroAmount, data!.euroTokenEuroAmount])}
          />
        </div>
        <div className={styles.walletBalanceActions}>
          <div className={styles.moneySuiteWrapper}>
            <MoneySuiteWidget
              currency="eur_token"
              largeNumber={data!.euroTokenAmount}
              value={data!.euroTokenEuroAmount}
              icon={moneyIcon}
              data-test-id="euro-widget"
              currencyTotal="eur"
            />
            {!isLocked && (
              <div className={styles.buttonsWrapper}>
                <Button layout="secondary">Withdraw funds ></Button>
                <Button layout="secondary" onClick={depositEuroTokenFunds}>
                  Deposit funds >
                </Button>
              </div>
            )}
          </div>
          <div className={styles.moneySuiteWrapper}>
            <MoneySuiteWidget
              currency="eth"
              largeNumber={data!.ethAmount}
              value={data!.ethEuroAmount}
              icon={ethIcon}
              data-test-id="euro-widget"
              currencyTotal="eur"
            />
            {!isLocked && (
              <div className={styles.buttonsWrapper}>
                <Button layout="secondary">Withdraw funds ></Button>
                <Button layout="secondary" onClick={depositEthFunds}>
                  Deposit funds >
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    )}
  </PanelDark>
);
