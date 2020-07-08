import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  ERoundingMode,
  TDataTestId,
} from "@neufund/shared-utils";
import * as React from "react";

import { Units } from "./atoms/Units";
import { IValueProps, Value } from "./atoms/Value";
import { ICommonMoneyProps } from "./types";
import { formatCurrency } from "./utils";

const WholeEurComponent: React.FunctionComponent<IValueProps & ICommonMoneyProps & TDataTestId> = ({
  className,
  value,
  defaultValue,
  "data-test-id": dataTestId,
}) => {
  const formattedValue =
    value &&
    formatCurrency({
      value,
      valueType: ECurrency.EUR,
      inputFormat: ENumberInputFormat.DECIMAL,
      outputFormat: ENumberOutputFormat.INTEGER,
      roundingMode: ERoundingMode.DOWN,
    });

  return (
    <span className={className} data-test-id={dataTestId}>
      <Value>{formattedValue || defaultValue || " "}</Value>
      <Units show={!!formattedValue}>&#x20;EUR</Units>
    </span>
  );
};

export const WholeEur = React.memo(WholeEurComponent);
