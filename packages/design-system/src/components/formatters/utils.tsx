import {
  EAbbreviatedNumberOutputFormat,
  ENumberInputFormat,
  ERoundingMode,
  formatNumber,
  formatShortNumber,
  selectDecimalPlaces,
  TBigNumberVariants,
  THumanReadableFormat,
  toFixedPrecision,
  TValueFormat,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

import { ICommonMoneyProps } from "./types";

interface IFormatCurrency {
  value: TBigNumberVariants;
  valueType: TValueFormat;
  inputFormat: ENumberInputFormat;
  outputFormat: THumanReadableFormat;
  roundingMode: ERoundingMode;
}

export const formatCurrency = ({
  value,
  valueType,
  roundingMode,
  inputFormat,
  outputFormat,
}: ICommonMoneyProps & IFormatCurrency): string => {
  const decimalPlaces = selectDecimalPlaces(valueType, outputFormat);

  const fixedZeroPrecision = toFixedPrecision({
    value: "0.000",
    inputFormat: ENumberInputFormat.ULPS,
    decimalPlaces: decimalPlaces,
    roundingMode: ERoundingMode.HALF_UP,
  });

  const fixedValuePrecision = toFixedPrecision({
    value,
    inputFormat: inputFormat,
    decimalPlaces: selectDecimalPlaces(valueType),
    roundingMode: ERoundingMode.HALF_UP,
  });

  if (!new BigNumber(value).isZero() && fixedZeroPrecision === fixedValuePrecision) {
    return `<${new BigNumber("10").toPower(-selectDecimalPlaces(valueType)).toString()}`;
  }

  if (
    outputFormat === EAbbreviatedNumberOutputFormat.SHORT ||
    outputFormat === EAbbreviatedNumberOutputFormat.LONG
  ) {
    return formatShortNumber({
      value,
      roundingMode,
      decimalPlaces,
      inputFormat,
      outputFormat,
      divider: undefined,
    });
  }

  return formatNumber({
    value,
    inputFormat,
    outputFormat,
    roundingMode,
    decimalPlaces,
  });
};
