import {
  ECurrency,
  ENumberInputFormat,
  ENumberOutputFormat,
  EquityToken,
  ETH_DECIMALS,
  formatNumber,
} from "@neufund/shared-utils";
import * as React from "react";

type TExternalProps = {
  value: string;
  currency: EquityToken | ECurrency;
  decimalPlaces: number;
};

// TODO: Used to keep money related logic easy to change. Replace with proper formatting when ready
const Money: React.FunctionComponent<TExternalProps> = ({ value, currency, decimalPlaces }) => (
  <>
    {formatNumber({
      value,
      outputFormat: ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
      inputFormat:
        decimalPlaces === ETH_DECIMALS ? ENumberInputFormat.ULPS : ENumberInputFormat.DECIMAL,
    })}{" "}
    {currency}
  </>
);

export { Money };
