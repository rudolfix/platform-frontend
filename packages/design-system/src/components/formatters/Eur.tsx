import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  formatCurrency,
  TDataTestId,
} from "@neufund/shared-utils";
import * as React from "react";

import { Units } from "./atoms/Units";
import { IValueProps, Value } from "./atoms/Value";
import { ICommonMoneyProps } from "./types";

interface IAdditionalProps {
  noSymbol?: boolean;
}

const EurComponent: React.FunctionComponent<IValueProps &
  ICommonMoneyProps &
  TDataTestId &
  IAdditionalProps> = ({
  className,
  value,
  defaultValue,
  "data-test-id": dataTestId,
  noSymbol,
}) => {
  const formattedValue =
    value &&
    formatCurrency({
      value,
      valueType: ECurrency.EUR,
      inputFormat: ENumberInputFormat.DECIMAL,
      outputFormat: ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
      roundingMode: ERoundingMode.DOWN,
    });

  const showUnits = formattedValue && !noSymbol;
  return (
    <span className={className} data-test-id={dataTestId}>
      <Value>{formattedValue || defaultValue || " "}</Value>
      {showUnits && <Units>&#x20;EUR</Units>}
    </span>
  );
};

export const Eur = React.memo(EurComponent);
