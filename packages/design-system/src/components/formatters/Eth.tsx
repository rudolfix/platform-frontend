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
import { ICommonFormatterProps } from "./types";

const EthComponent: React.FunctionComponent<IValueProps & ICommonFormatterProps & TDataTestId> = ({
  className,
  value,
  defaultValue,
  "data-test-id": dataTestId,
}) => {
  const formattedValue =
    value &&
    formatCurrency({
      value,
      valueType: ECurrency.ETH,
      inputFormat: ENumberInputFormat.ULPS,
      outputFormat: ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
      roundingMode: ERoundingMode.DOWN,
    });

  return (
    <span className={className} data-test-id={dataTestId}>
      <Value>{formattedValue || defaultValue || " "}</Value>
      {formattedValue && <Units>&#x20;ETH</Units>}
    </span>
  );
};

export const Eth = React.memo(EthComponent);
