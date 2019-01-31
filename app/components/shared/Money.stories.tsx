import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ECurrency, ECurrencySymbol, EMoneyFormat, Money } from "./Money";

const value = "1234567" + "0".repeat(18);

storiesOf("Money", module)
  .add("default (with currency code)", () => (
    <>
      <Money currency={ECurrency.EUR} value={value} />
      <br />
      <Money currency={ECurrency.NEU} value={value} />
      <br />
      <Money currency={ECurrency.EUR_TOKEN} value={value} />
      <br />
      <Money currency={ECurrency.ETH} value={value} />
    </>
  ))
  .add("with currency symbol", () => (
    <>
      <Money currency={ECurrency.EUR} value={value} currencySymbol={ECurrencySymbol.SYMBOL} />
      <br />
      <Money
        value={100}
        currency={ECurrency.EUR}
        format={EMoneyFormat.FLOAT}
        currencySymbol={ECurrencySymbol.SYMBOL}
      />
    </>
  ))
  .add("transfer", () => (
    <>
      <Money currency={ECurrency.EUR} value={value} transfer="income" />
      <br />
      <Money currency={ECurrency.EUR} value={value} transfer="outcome" />
    </>
  ))
  .add("no currency symbol", () => (
    <Money currency={ECurrency.EUR} value={value} currencySymbol={ECurrencySymbol.NONE} />
  ))
  .add("themed", () => (
    <>
      <p>t-green</p>
      <Money currency={ECurrency.EUR} value={value} theme="t-green" />
      <br />
      <p>t-orange</p>
      <Money currency={ECurrency.ETH} value="20000000000000000" theme="t-orange" />
    </>
  ))
  .add("price format", () => (
    <>
      <Money
        currency={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.SYMBOL}
        isPrice={true}
      />
      <br />
      <Money
        currency={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.NONE}
        isPrice={true}
      />
      <br />
      <Money
        currency={ECurrency.EUR}
        value={"32376189" + "0".repeat(10)}
        currencySymbol={ECurrencySymbol.CODE}
        isPrice={true}
      />
      <br />
      <Money currency={ECurrency.ETH} value={"4212376189" + "0".repeat(10)} isPrice={true} />
      <br />
      <Money currency={ECurrency.NEU} value={"353212376189" + "0".repeat(10)} isPrice={true} />
    </>
  ));
