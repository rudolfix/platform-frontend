import { ITokenDisbursal } from "@neufund/shared-modules";
import { ECurrency, EthereumAddressWithChecksum, ETH_DECIMALS } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { InvestorAcceptPayoutSummaryLayout } from "./AcceptSummary";

const ethTokenDisbursal: ITokenDisbursal = {
  token: ECurrency.ETH,
  amountToBeClaimed: "6.582870355588135389497e+21",
  totalDisbursedAmount: "9.7154607e+22",
  timeToFirstDisbursalRecycle: 1675401473000,
  tokenDecimals: ETH_DECIMALS,
  amountEquivEur: "984609705",
};

const nEurTokenDisbursal: ITokenDisbursal = {
  token: ECurrency.EUR_TOKEN,
  amountToBeClaimed: "6.582870355588135389497e+21",
  totalDisbursedAmount: "9.7154607e+22",
  timeToFirstDisbursalRecycle: 1675401473000,
  tokenDecimals: ETH_DECIMALS,
  amountEquivEur: "970746877.21980140173352",
};

storiesOf("InvestorPayout/AcceptSummary", module)
  .addDecorator(withModalBody())
  .add("ETH", () => (
    <InvestorAcceptPayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      additionalData={{
        tokensDisbursals: [ethTokenDisbursal],
        gasCostEth: "123444",
        gasCostEuro: "27",
        totalPayoutEuro: "98460970",
        payoutLowerThanMinimum: false,
      }}
      onAccept={action("onAccept")}
    />
  ))
  .add("nEur", () => (
    <InvestorAcceptPayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      additionalData={{
        tokensDisbursals: [nEurTokenDisbursal],
        gasCostEth: "123444",
        gasCostEuro: "27",
        totalPayoutEuro: "984609705509027210028",
        payoutLowerThanMinimum: false,
      }}
      onAccept={action("onAccept")}
    />
  ))
  .add("all", () => (
    <InvestorAcceptPayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      additionalData={{
        tokensDisbursals: [ethTokenDisbursal, nEurTokenDisbursal],
        gasCostEth: "123444",
        gasCostEuro: "27",
        totalPayoutEuro: "984609705509",
        payoutLowerThanMinimum: false,
      }}
      onAccept={action("onAccept")}
    />
  ))
  .add("all with payout total lower than minimum", () => (
    <InvestorAcceptPayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      additionalData={{
        tokensDisbursals: [ethTokenDisbursal, nEurTokenDisbursal],
        gasCostEth: "123444",
        gasCostEuro: "27",
        totalPayoutEuro: "-23424",
        payoutLowerThanMinimum: true,
      }}
      onAccept={action("onAccept")}
    />
  ));
