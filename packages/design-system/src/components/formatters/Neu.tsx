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

const NeuComponent: React.FunctionComponent<IValueProps & ICommonFormatterProps & TDataTestId> = ({
  className,
  value,
  defaultValue,
  "data-test-id": dataTestId,
}) => {
  const formattedValue =
    value &&
    formatCurrency({
      value,
      valueType: ECurrency.NEU,
      inputFormat: ENumberInputFormat.ULPS,
      outputFormat: ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
      roundingMode: ERoundingMode.DOWN,
    });

  return (
    <span className={className} data-test-id={dataTestId}>
      <Value>{formattedValue || defaultValue || " "}</Value>
      {formattedValue && <Units>&#x20;NEU</Units>}
    </span>
  );
};

export const Neu = React.memo(NeuComponent);
