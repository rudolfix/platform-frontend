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

const EurTokenComponent: React.FunctionComponent<IValueProps &
  ICommonMoneyProps &
  TDataTestId & { symbolAsEuro?: boolean }> = ({
  className,
  value,
  defaultValue,
  "data-test-id": dataTestId,
  symbolAsEuro = false,
}) => {
  const formattedValue =
    value &&
    formatCurrency({
      value,
      valueType: ECurrency.EUR_TOKEN,
      inputFormat: ENumberInputFormat.ULPS,
      outputFormat: ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
      roundingMode: ERoundingMode.DOWN,
    });

  return (
    <span className={className} data-test-id={dataTestId}>
      <Value>{formattedValue || defaultValue || " "}</Value>
      {formattedValue && <Units>&#x20;{symbolAsEuro ? "EUR" : "nEUR"}</Units>}
    </span>
  );
};

export const EurToken = React.memo(EurTokenComponent);
