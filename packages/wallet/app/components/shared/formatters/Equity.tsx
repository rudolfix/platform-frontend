import {
  ENumberOutputFormat,
  ERoundingMode,
  TToken,
  formatCurrency,
  EquityToken,
} from "@neufund/shared-utils";
import * as React from "react";
import { Text } from "react-native";

import { Units } from "./atoms/Units";
import { Value } from "./atoms/Value";

type TExternalProps = {
  token: TToken<EquityToken>;
} & React.ComponentProps<typeof Text>;

const EquityComponent: React.FunctionComponent<TExternalProps> = ({ token, ...props }) => {
  const formattedValue = formatCurrency({
    value: token.value,
    valueType: token.type,
    inputFormat: token.precision,
    outputFormat: ENumberOutputFormat.ONLY_NONZERO_DECIMALS,
    roundingMode: ERoundingMode.DOWN,
  });

  return (
    <Text {...props}>
      <Value>{formattedValue}</Value>
      {formattedValue && <Units>&#x20;{token.type.toUpperCase()}</Units>}
    </Text>
  );
};

export const Equity = React.memo(EquityComponent);
