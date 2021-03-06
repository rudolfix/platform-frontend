import {
  ECurrency,
  ENumberInputFormat,
  ERoundingMode,
  selectDecimalPlaces,
  toFixedPrecision,
} from "@neufund/shared-utils";

export const toFormValue = (amountUlps: string, decimals?: number) =>
  toFixedPrecision({
    value: amountUlps,
    decimalPlaces: selectDecimalPlaces(ECurrency.ETH),
    inputFormat: ENumberInputFormat.ULPS,
    roundingMode: ERoundingMode.DOWN,
    decimals,
  });

export const toFixedPrecisionGasCostEth = (value: string) =>
  toFixedPrecision({
    value,
    inputFormat: ENumberInputFormat.ULPS,
    decimalPlaces: selectDecimalPlaces(ECurrency.ETH),
    roundingMode: ERoundingMode.HALF_UP,
  });

export const toFixedPrecisionGasCostEur = (value: string) =>
  toFixedPrecision({
    value,
    inputFormat: ENumberInputFormat.ULPS,
    decimalPlaces: selectDecimalPlaces(ECurrency.EUR),
    roundingMode: ERoundingMode.HALF_UP,
  });

export const toFixedPrecisionAmountEth = (value: string) =>
  toFixedPrecision({
    value,
    inputFormat: ENumberInputFormat.ULPS,
    decimalPlaces: selectDecimalPlaces(ECurrency.ETH),
    roundingMode: ERoundingMode.DOWN,
  });

export const toFixedPrecisionAmountEur = (value: string) =>
  toFixedPrecision({
    value,
    inputFormat: ENumberInputFormat.DECIMAL,
    decimalPlaces: selectDecimalPlaces(ECurrency.EUR),
    roundingMode: ERoundingMode.DOWN,
  });
