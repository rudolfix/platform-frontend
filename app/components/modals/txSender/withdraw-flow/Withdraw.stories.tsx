import { storiesOf } from "@storybook/react";
import * as React from "react";

import { dummyEthereumAddress } from "../../../../../test/fixtures";
import { IGasState } from "../../../../modules/gas/reducer";
import { WithdrawComponent } from "./Withdraw";

const gas: IGasState = {
  loading: false,
  gasPrice: {
    fast: "0",
    fastest: "0",
    safeLow: "0",
    standard: "23000000000",
  },
};

storiesOf("Withdraw", module)
  .add("default", () => (
    <WithdrawComponent onAccept={() => {}} gas={gas} address={dummyEthereumAddress} />
  ))
  .add("loading gas info", () => (
    <WithdrawComponent onAccept={() => {}} gas={{ loading: true }} address={dummyEthereumAddress} />
  ))
  .add("loading gas error", () => (
    <WithdrawComponent
      onAccept={() => {}}
      gas={{ loading: false, error: "Some error" }}
      address={dummyEthereumAddress}
    />
  ));
