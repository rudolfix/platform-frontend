import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { EHumanReadableFormat, EMoneyInputFormat, ERoundingMode, formatNumber } from "./utils";

import * as styles from "./FormatNumber.module.scss";

interface INumberRangeProps {
  valueFrom: string | BigNumber | number | undefined | null;
  valueUpto: string | BigNumber | number | undefined | null;
  defaultValue?: string;
  decimalPlaces?: number;
  inputFormat?: EMoneyInputFormat;
  outputFormat?: EHumanReadableFormat;
  isPrice?: boolean;
  roundingMode?: ERoundingMode;
  separator?: string;
  className?: string;
}

export const FormatNumberRange: React.FunctionComponent<INumberRangeProps> = ({
  valueFrom,
  valueUpto,
  defaultValue = "",
  roundingMode = ERoundingMode.UP,
  decimalPlaces = 4,
  inputFormat = EMoneyInputFormat.ULPS,
  outputFormat = EHumanReadableFormat.FULL,
  isPrice = false,
  separator = "–", //todo nowrap before (?)
  className,
}) => {
  if (valueFrom && valueUpto) {
    return (
      <span className={cn(styles.noBreak, className)}>
        {`${formatNumber({
          value: valueFrom,
          roundingMode,
          decimalPlaces,
          inputFormat,
          isPrice,
          outputFormat,
        })}${separator}${formatNumber({
          value: valueUpto,
          roundingMode,
          decimalPlaces,
          inputFormat,
          outputFormat,
          isPrice,
        })}`}
      </span>
    );
  } else {
    return <span>{defaultValue}</span>;
  }
};