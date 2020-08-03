import { convertFromUlps } from "@neufund/shared-utils";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { PaddedWrapper } from "../../storybook-decorators";
import { EquityTokenPriceEuro } from "./EquityTokenPriceEuro";
import { Eth } from "./Eth";
import { Eur } from "./Eur";
import { EurToken } from "./EurToken";
import { Neu } from "./Neu";
import { Percentage } from "./Percentage";
import { WholeEur } from "./WholeEur";
import { WholeEurShort } from "./WholeEurShort";

const valuesDefault = [
  "TBA",
  "0",
  "4212376189" + "0".repeat(10),
  "353212376189" + "0".repeat(10),
  "1234567" + "0".repeat(18),
  "0.000012354",
];

const valuesDecimal = [
  "TBA",
  "0",
  ...[valuesDefault[2], valuesDefault[3], valuesDefault[4]].map(value =>
    convertFromUlps(value).toString(),
  ),
  "0.000012354",
];

const generateStory = (
  title: string,
  Component:
    | typeof Eth
    | typeof Eur
    | typeof EurToken
    | typeof Neu
    | typeof EquityTokenPriceEuro
    | typeof Percentage,
  values: Array<string> = [],
) => (
  <>
    <h5>{title}</h5>
    <Component defaultValue={values[0]} value={undefined} />
    <br />
    <Component value={values[1]} />
    <br />
    <Component value={values[2]} />
    <br />
    <Component value={values[3]} />
    <br />
    <Component value={values[4]} />
    <br />
    <Component value={values[5]} />
    <br />
    <br />
  </>
);

storiesOf("NDS|Molecules/Formatters", module).add("All", () => (
  <PaddedWrapper>
    {generateStory("Eth", Eth, valuesDefault)}
    {generateStory("Eur", Eur, valuesDecimal)}
    {generateStory("WholeEur", WholeEur, valuesDecimal)}
    {generateStory("WholeEurShort", WholeEurShort, valuesDecimal)}
    {generateStory("EurToken", EurToken, valuesDefault)}
    {generateStory("Neu", Neu, valuesDefault)}
    {generateStory("EquityTokenPriceEuro", EquityTokenPriceEuro, valuesDefault)}
    {generateStory("Percentage", Percentage, valuesDefault)}
  </PaddedWrapper>
));
