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
import { ScrollView, Text } from "react-native";

import { LineBreak } from "components/shared/LineBreak";

import { MoneyUnsafe } from "./MoneyUnsafe";

const getTokens = (currency: ECurrency | EquityToken) => [
  createToken(currency, "0", ENumberInputFormat.DECIMAL),
  createToken(currency, "4212376189" + "0".repeat(10), ENumberInputFormat.DECIMAL),
  createToken(currency, "353212376189" + "0".repeat(10), ENumberInputFormat.DECIMAL),
  createToken(currency, "1234567" + "0".repeat(18), ENumberInputFormat.ULPS),
  createToken(currency, "0.000012354", ENumberInputFormat.DECIMAL),
];

const generateStory = (title: string, tokens: TToken[]) => (
  <>
    <Text>{title}</Text>
    {tokens.map(token => (
      <>
        <MoneyUnsafe token={token} />
        <LineBreak />
      </>
    ))}
  </>
);

storiesOf("Atoms|MoneyUnsafe", module).add("All", () => (
  <ScrollView>
    {generateStory("Eth", getTokens(ECurrency.ETH))}
    {generateStory("Eur", getTokens(ECurrency.EUR))}
    {generateStory("EurToken", getTokens(ECurrency.EUR_TOKEN))}
    {generateStory("Neu", getTokens(ECurrency.NEU))}
    {generateStory("Equity", getTokens(toEquityTokenSymbol("FFT")))}
  </ScrollView>
));
