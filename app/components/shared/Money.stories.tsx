import { storiesOf } from "@storybook/react";
import * as React from "react";

import { Money } from "./Money";

const value = "1234567" + "0".repeat(18);

storiesOf("Money", module)
  .add("default", () => (
    <>
      <Money currency="eur" value={value} />
      <br />
      <Money currency="neu" value={value} />
      <br />
      <Money currency="eur_token" value={value} />
      <br />
      <Money currency="eth" value={value} />
    </>
  ))
  .add("transfer", () => (
    <>
      <Money currency="eur" value={value} transfer="income" />
      <br />
      <Money currency="eur" value={value} transfer="outcome" />
    </>
  ))
  .add("no currency symbol", () => <Money currency="eur" value={value} noCurrencySymbol={true} />)
  .add("themed", () => (
    <>
      <p>t-green</p>
      <Money currency="eur" value={value} theme="t-green" />
    </>
  ));
