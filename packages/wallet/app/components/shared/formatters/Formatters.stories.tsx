import {
  createToken,
  ECurrency,
  ENumberInputFormat,
  EquityToken,
  toEquityTokenSymbol,
  TToken,
} from "@neufund/shared-utils";
import { storiesOf } from "@storybook/react-native";
import * as React from "react";
import { Text, ScrollView } from "react-native";

import { LineBreak } from "components/shared/LineBreak";

import { Equity } from "./Equity";
import { Eth } from "./Eth";
import { Eur } from "./Eur";
import { EurToken } from "./EurToken";
import { Neu } from "./Neu";

const getTokens = <T extends ECurrency | EquityToken>(currency: T) => [
  createToken(currency, "0", ENumberInputFormat.DECIMAL),
  createToken(currency, "42123761890", ENumberInputFormat.DECIMAL),
  createToken(currency, "353212376189" + "0".repeat(10), ENumberInputFormat.ULPS),
  createToken(currency, "1234567" + "0".repeat(18), ENumberInputFormat.ULPS),
  createToken(currency, "0.000012354", ENumberInputFormat.DECIMAL),
];

const generateStory = <T extends ECurrency | EquityToken>(
  title: string,
  Component: React.ComponentType<{ token: TToken<T> }>,
  tokens: Array<TToken<T>>,
) => (
  <>
    <Text>{title}</Text>
    {tokens.map((token, i) => (
      <React.Fragment key={i}>
        <Component token={token} />
        <LineBreak />
      </React.Fragment>
    ))}
  </>
);

storiesOf("Atoms|Formatters", module).add("All", () => (
  <ScrollView>
    {generateStory("Eth", Eth, getTokens(ECurrency.ETH))}
    {generateStory("Eur", Eur, getTokens(ECurrency.EUR))}
    {generateStory("EurToken", EurToken, getTokens(ECurrency.EUR_TOKEN))}
    {generateStory("Neu", Neu, getTokens(ECurrency.NEU))}
    {generateStory("Equity", Equity, getTokens(toEquityTokenSymbol("FFT")))}
  </ScrollView>
));
