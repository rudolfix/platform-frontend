import {
  ENumberInputFormat,
  ENumberOutputFormat,
  EPriceFormat,
  ERoundingMode,
  formatCurrency,
  TDataTestId,
} from "@neufund/shared-utils";
import * as React from "react";

import { Units } from "./atoms/Units";
import { IValueProps, Value } from "./atoms/Value";
import { ICommonFormatterProps } from "./types";

const EquityTokenPriceEuroComponent: React.FunctionComponent<IValueProps &
  ICommonFormatterProps &
  TDataTestId> = ({ className, value, defaultValue, "data-test-id": dataTestId }) => {
  const formattedValue =
    value &&
    formatCurrency({
      value,
      valueType: EPriceFormat.EQUITY_TOKEN_PRICE_EURO,
      inputFormat: ENumberInputFormat.DECIMAL,
      outputFormat: ENumberOutputFormat.FULL,
      roundingMode: ERoundingMode.DOWN,
    });

  return (
    <span className={className} data-test-id={dataTestId}>
      <Value>{formattedValue || defaultValue || " "}</Value>
      {formattedValue && <Units>&#x20;EUR</Units>}
    </span>
  );
};

export const EquityTokenPriceEuro = React.memo(EquityTokenPriceEuroComponent);
