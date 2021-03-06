import BigNumber, { Configuration } from "bignumber.js";

import { ENumberOutputFormat, ERoundingMode, THumanReadableFormat } from "./types";

export function getBigNumberRoundingMode(
  roundingMode: ERoundingMode,
  outputFormat: THumanReadableFormat = ENumberOutputFormat.FULL,
): NonNullable<Configuration["ROUNDING_MODE"]> {
  if (
    outputFormat === ENumberOutputFormat.FULL_ROUND_UP ||
    outputFormat === ENumberOutputFormat.ONLY_NONZERO_DECIMALS_ROUND_UP
  ) {
    return BigNumber.ROUND_UP;
  } else if (outputFormat === ENumberOutputFormat.INTEGER) {
    return BigNumber.ROUND_HALF_DOWN;
  } else {
    switch (roundingMode) {
      case ERoundingMode.DOWN:
        return BigNumber.ROUND_DOWN;
      case ERoundingMode.HALF_DOWN:
        return BigNumber.ROUND_HALF_DOWN;
      case ERoundingMode.HALF_UP:
        return BigNumber.ROUND_HALF_UP;
      case ERoundingMode.UP:
      default:
        return BigNumber.ROUND_UP;
    }
  }
}
