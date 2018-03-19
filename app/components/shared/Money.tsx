import * as React from "react";
import { MONEY_DECIMALS } from "../../config/constants";
import { formatMoney, formatThousands } from "./Money.utils";

export type TCurrency = "neu" | "eur" | "eur_token" | "eth";

interface IOwnProps extends React.HTMLAttributes<HTMLSpanElement> {
  currency: TCurrency;
  value: string;
  doNotSeparateThousands?: boolean;
  noCurrencySymbol?: boolean;
  currencyClassName?: string;
  currencyStyle?: React.CSSProperties;
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
  noCurrencySymbol,
  ...props
}) => {
  const decimalPlaces = selectDecimalPlaces(currency);
  const currencySymbol = selectCurrencySymbol(currency);

  const formattedMoney = doNotSeparateThousands
    ? formatMoney(value, MONEY_DECIMALS, decimalPlaces)
    : formatThousands(formatMoney(value, MONEY_DECIMALS, decimalPlaces));

  return (
    <span {...props}>
      {formattedMoney}{" "}
      <span className={currencyClassName} style={currencyStyle}>
        {noCurrencySymbol ? "" : currencySymbol}
      </span>
    </span>
  );
};
