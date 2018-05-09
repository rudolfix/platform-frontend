import * as cn from "classnames";
import * as React from "react";
import { MONEY_DECIMALS } from "../../config/constants";
import * as styles from "./Money.module.scss";
import { formatMoney, formatThousands } from "./Money.utils";

export type TCurrency = "neu" | "eur" | "eur_token" | "eth";

export type TMoneyTransfer = "income" | "outcome";

type TTheme = "t-green";

interface IOwnProps extends React.HTMLAttributes<HTMLSpanElement> {
  currency: TCurrency;
  value: string;
  doNotSeparateThousands?: boolean;
  noCurrencySymbol?: boolean;
  currencyClassName?: string;
  currencyStyle?: React.CSSProperties;
  transfer?: TMoneyTransfer;
  theme?: TTheme;
}

type IProps = IOwnProps;

export const selectDecimalPlaces = (currency: TCurrency): number => {
  switch (currency) {
    case "eth":
      return 4;
    case "neu":
      return 4;
    case "eur":
      return 2;
    case "eur_token":
      return 2;
  }
};

export const selectCurrencySymbol = (currency: TCurrency): string => {
  switch (currency) {
    case "eth":
      return "ETH";
    case "neu":
      return "NEU";
    case "eur":
      return "EUR";
    case "eur_token":
      return "nEUR";
  }
};

export const Money: React.SFC<IProps> = ({
  value,
  currency,
  currencyClassName,
  currencyStyle,
  doNotSeparateThousands,
  transfer,
  noCurrencySymbol,
  theme,
  ...props
}) => {
  const decimalPlaces = selectDecimalPlaces(currency);
  const currencySymbol = selectCurrencySymbol(currency);

  const formattedMoney = doNotSeparateThousands
    ? formatMoney(value, MONEY_DECIMALS, decimalPlaces)
    : formatThousands(formatMoney(value, MONEY_DECIMALS, decimalPlaces));

  return (
    <span {...props} className={cn(styles.money, transfer, props.className, theme)}>
      {formattedMoney}{" "}
      <span className={cn(currencyClassName)} style={currencyStyle}>
        {noCurrencySymbol ? "" : currencySymbol}
      </span>
    </span>
  );
};
