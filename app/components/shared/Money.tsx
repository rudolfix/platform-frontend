import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { MONEY_DECIMALS } from "../../config/constants";
import { formatMoney, formatThousands } from "../../utils/Money.utils";

import * as styles from "./Money.module.scss";

enum ECurrencySymbol {
  SYMBOL = "symbol",
  CODE = "code",
  NONE = "none",
}

type TCurrency = "neu" | "eur" | "eur_token" | "eth";

enum EMoneyFormat {
  WEI = "wei",
  FLOAT = "float",
}

type TMoneyTransfer = "income" | "outcome";

type TTheme = "t-green" | "t-orange";

interface IOwnProps extends React.HTMLAttributes<HTMLSpanElement> {
  currency: TCurrency;
  value?: React.ReactElement<any> | string | BigNumber | number | null;
  format?: EMoneyFormat;
  doNotSeparateThousands?: boolean;
  currencySymbol?: ECurrencySymbol;
  currencyClassName?: string;
  currencyStyle?: React.CSSProperties;
  transfer?: TMoneyTransfer;
  theme?: TTheme;
}

type IProps = IOwnProps;

const selectDecimalPlaces = (currency: TCurrency): number => {
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

const selectCurrencyCode = (currency: TCurrency): string => {
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

const selectCurrencySymbol = (currency: TCurrency): string => {
  switch (currency) {
    case "eur":
      return "€";
    default:
      throw new Error("Only EUR can be displayed as a symbol");
  }
};

function getFormattedMoney(value: string | BigNumber, currency: TCurrency): string {
  const decimalPlaces = selectDecimalPlaces(currency);

  return formatMoney(value, MONEY_DECIMALS, decimalPlaces);
}

const Money: React.SFC<IProps> = ({
  value,
  format = EMoneyFormat.WEI,
  currency,
  currencyClassName,
  currencyStyle,
  doNotSeparateThousands,
  transfer,
  currencySymbol = ECurrencySymbol.CODE,
  theme,
  ...props
}) => {
  if (!value) {
    return <>-</>;
  }

  const money =
    format === EMoneyFormat.WEI && !React.isValidElement(value)
      ? getFormattedMoney(value as BigNumber, currency)
      : value;

  const formattedMoney =
    !doNotSeparateThousands && !React.isValidElement(money)
      ? formatThousands(money.toString())
      : money;

  return (
    <span {...props} className={cn(styles.money, transfer, props.className, theme)}>
      {currencySymbol === ECurrencySymbol.SYMBOL && (
        <span className={cn(currencyClassName)} style={currencyStyle}>
          {selectCurrencySymbol(currency)}
        </span>
      )}
      {formattedMoney}
      {currencySymbol === ECurrencySymbol.CODE && (
        <span className={cn(currencyClassName)} style={currencyStyle}>
          {" "}
          {selectCurrencyCode(currency)}
        </span>
      )}
    </span>
  );
};

export {
  Money,
  selectCurrencySymbol,
  selectCurrencyCode,
  selectDecimalPlaces,
  TMoneyTransfer,
  EMoneyFormat,
  TCurrency,
  ECurrencySymbol,
};
