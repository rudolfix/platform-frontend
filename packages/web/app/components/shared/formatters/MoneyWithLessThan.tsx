import { isZero } from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import * as cn from "classnames";
import * as React from "react";

import { CommonHtmlProps } from "../../../types";
import { IMoneyCommonProps, Money } from "./Money";
import { ERoundingMode, selectDecimalPlaces, selectUnits, toFixedPrecision } from "./utils";

import * as styles from "./Money.module.scss";

export const MoneyWithLessThan: React.FunctionComponent<{
  value: string;
} & IMoneyCommonProps &
  CommonHtmlProps> = ({ value, valueType, inputFormat, ...props }) => {
  const fixedZeroPrecision = toFixedPrecision({
    value: "0",
    inputFormat: inputFormat,
    decimalPlaces: selectDecimalPlaces(valueType),
  });

  //TODO: Refactor Money + Formatters to reuse the components
  return fixedZeroPrecision ===
    toFixedPrecision({
      value,
      inputFormat,
      decimalPlaces: selectDecimalPlaces(valueType),
      roundingMode: ERoundingMode.DOWN,
    }) && !isZero(value) ? (
    <span className={cn(styles.money, props.className, props.theme)}>
      &#60; {new BigNumber("10").toPower(-selectDecimalPlaces(valueType)).toString()}
      <span className={cn(styles.currency)} data-test-id="units">
        {" "}
        {selectUnits(valueType)}
      </span>
    </span>
  ) : (
    <Money value={value} valueType={valueType} inputFormat={inputFormat} {...props} />
  );
};
