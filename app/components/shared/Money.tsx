import * as React from "react";
import { selectDecimals, TCurrency } from "../../modules/money/reducer";
import { appConnect } from "../../store";
import { formatMoney, formatThousands } from "./Money.utils";

interface IOwnProps extends React.HTMLAttributes<HTMLSpanElement> {
  currency: TCurrency;
  value: string;
  doNotSeparateThousands?: boolean;
  currencyClassName?: string;
  currencyStyle?: React.CSSProperties;
}

interface IStateProps {
  decimals: number;
}

type IProps = IOwnProps & IStateProps;

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

export const MoneyComponent: React.SFC<IProps> = ({
  value,
  decimals,
  currency,
  currencyClassName,
  currencyStyle,
  doNotSeparateThousands,
  ...props
}) => {
  const decimalPlaces = selectDecimalPlaces(currency);
  const currencySymbol = selectCurrencySymbol(currency);

  const formattedMoney = doNotSeparateThousands
    ? formatMoney(value, decimals, decimalPlaces)
    : formatThousands(formatMoney(value, decimals, decimalPlaces));

  return (
    <span {...props}>
      {formattedMoney}{" "}
      <span className={currencyClassName} style={currencyStyle}>
        {currencySymbol}
      </span>
    </span>
  );
};

export const Money = appConnect<IStateProps, {}, IOwnProps>({
  stateToProps: (state, ownProps) => ({
    decimals: selectDecimals(state.money, ownProps.currency),
  }),
})(MoneyComponent);
