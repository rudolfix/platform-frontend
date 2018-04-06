import BigNumber from "bignumber.js";
import { mapValues } from "lodash";

export function numericValuesToString<T extends { [P in keyof T]: string | BigNumber }>(
  entity: T,
): { [P in keyof T]: string } {
  return mapValues(entity, e => e.toString()) as any;
}
