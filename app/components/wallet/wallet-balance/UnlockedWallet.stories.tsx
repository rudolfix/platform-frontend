import { storiesOf } from "@storybook/react";
import * as React from "react";
import { UnlockedWallet } from "./UnlockedWallet";

storiesOf("ICBM Wallet", module)
  .add("Normal Wallet", () => (
    <UnlockedWallet
      data={{
        ethAmount: "0",
        ethEuroAmount: "0",
        neuroAmount: "0",
        neuroEuroAmount: "0",
        totalEuroAmount: "0",
      }}
    />
  ))
  .add("With Eth only", () => (
    <UnlockedWallet
      data={{
        ethAmount: "1",
        ethEuroAmount: "1",
        neuroAmount: "0",
        neuroEuroAmount: "0",
        totalEuroAmount: "0",
      }}
    />
  ))
  .add("With Euro only", () => (
    <UnlockedWallet
      data={{
        ethAmount: "0",
        ethEuroAmount: "0",
        neuroAmount: "1",
        neuroEuroAmount: "1",
        totalEuroAmount: "0",
      }}
    />
  ))
  .add("With Both Values", () => (
    <UnlockedWallet
      data={{
        ethAmount: "1",
        ethEuroAmount: "1",
        neuroAmount: "1",
        neuroEuroAmount: "1",
        totalEuroAmount: "0",
      }}
    />
  ))
  .add("With Both Values But no Callback Function", () => (
    <UnlockedWallet
      data={{
        ethAmount: "1",
        ethEuroAmount: "1",
        neuroAmount: "1",
        neuroEuroAmount: "1",
        totalEuroAmount: "0",
      }}
    />
  ))
  .add("With Both Values and Callbacks but target not set", () => (
    <UnlockedWallet
      data={{
        hasFunds: true,
        isEtherUpgradeTargetSet: false,
        isEuroUpgradeTargetSet: false,
        ethAmount: "1",
        ethEuroAmount: "1",
        neuroAmount: "1",
        neuroEuroAmount: "1",
        totalEuroAmount: "0",
      }}
    />
  ));
