import {
  ENumberFormat,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  TDataTestId,
} from "@neufund/shared-utils";
import * as React from "react";

import { Units } from "./atoms/Units";
import { IValueProps, Value } from "./atoms/Value";
import { ICommonFormatterProps } from "./types";
import { formatCurrency } from "./utils";

const PercentageComponent: React.FunctionComponent<IValueProps &
  ICommonFormatterProps &
  TDataTestId> = ({ className, value, defaultValue, "data-test-id": dataTestId }) => {
  const formattedValue =
    value &&
    formatCurrency({
      value,
      valueType: ENumberFormat.PERCENTAGE,
      inputFormat: ENumberInputFormat.DECIMAL,
      outputFormat: ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
      roundingMode: ERoundingMode.DOWN,
    });

  return (
    <span className={className} data-test-id={dataTestId}>
      <Value>{formattedValue || defaultValue || " "}</Value>
      <Units show={!!formattedValue}>%</Units>
    </span>
  );
};

export const Percentage = React.memo(PercentageComponent);
