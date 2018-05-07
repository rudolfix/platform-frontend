// tslint:disable-next-line:no-implicit-dependencies
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { WalletBalance } from "./WalletBalance";

storiesOf("WalletBalance", module)
  .add("loaded and locked", () => (
    <WalletBalance
      isLocked={false}
      headerText="Your wallet balance | LOADED & LOCKED"
      depositEuroTokenFunds={() => {}}
      depositEthFunds={() => {}}
      isLoading={false}
      data={{
        euroTokenAmount: "100000000000000000000000000",
        euroTokenEuroAmount: "100000000000000000000000000",
        ethAmount: "100000000000000000000000000",
        ethEuroAmount: "100000000000000000000000000",
        totalEuroAmount: "100000000000000000000000000",
      }}
    />
  ))
  .add("loaded, locked and empty", () => (
    <WalletBalance
      isLocked={true}
      headerText="Your wallet balance | LOADED & LOCKED & EMPTY"
      depositEuroTokenFunds={() => {}}
      depositEthFunds={() => {}}
      isLoading={false}
      data={{
        euroTokenAmount: "0",
        euroTokenEuroAmount: "0",
        ethAmount: "0",
        ethEuroAmount: "0",
        totalEuroAmount: "0",
      }}
    />
  ))
  .add("loaded and unlocked", () => (
    <WalletBalance
      isLocked={false}
      headerText="Your wallet balance | LOADED & LOCKED"
      depositEuroTokenFunds={() => {}}
      depositEthFunds={() => {}}
      isLoading={false}
      data={{
        euroTokenAmount: "100000000000000000000000000",
        euroTokenEuroAmount: "100000000000000000000000000",
        ethAmount: "100000000000000000000000000",
        ethEuroAmount: "100000000000000000000000000",
        totalEuroAmount: "100000000000000000000000000",
      }}
    />
  ))
  .add("loading", () => (
    <WalletBalance
      isLocked={true}
      headerText="Your wallet balance | LOADED & LOCKED"
      depositEuroTokenFunds={() => {}}
      depositEthFunds={() => {}}
      isLoading={true}
      data={{
        euroTokenAmount: "100000000000000000000000000",
        euroTokenEuroAmount: "100000000000000000000000000",
        ethAmount: "100000000000000000000000000",
        ethEuroAmount: "100000000000000000000000000",
        totalEuroAmount: "100000000000000000000000000",
      }}
    />
  ));
