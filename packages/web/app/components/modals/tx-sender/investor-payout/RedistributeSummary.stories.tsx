import { ITokenDisbursal } from "@neufund/shared-modules";
import { ECurrency, ETH_DECIMALS, EthereumAddressWithChecksum } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { InvestorRedistributePayoutSummaryLayout } from "./RedistributeSummary";

const ethTokenDisbursal: ITokenDisbursal = {
  token: ECurrency.ETH,
  amountToBeClaimed: "6.582870355588135389497e+21",
  totalDisbursedAmount: "9.7154607e+22",
  timeToFirstDisbursalRecycle: 1675401473000,
  tokenDecimals: ETH_DECIMALS,
  amountEquivEur: "984609705509027210028",
};

const nEurTokenDisbursal: ITokenDisbursal = {
  token: ECurrency.EUR_TOKEN,
  amountToBeClaimed: "6.582870355588135389497e+21",
  totalDisbursedAmount: "9.7154607e+22",
  timeToFirstDisbursalRecycle: 1675401473000,
  tokenDecimals: ETH_DECIMALS,
  amountEquivEur: "97078346877766094590.21980140173352",
};

storiesOf("InvestorPayout/RedistributeSummary", module)
  .addDecorator(withModalBody())
  .add("ETH", () => (
    <InvestorRedistributePayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      additionalData={{ tokenDisbursals: ethTokenDisbursal }}
      onAccept={action("onAccept")}
    />
  ))
  .add("nEur", () => (
    <InvestorRedistributePayoutSummaryLayout
      walletAddress={"0x00b30CC2cc22c9820d47a4E0C9E1A54455bA0883" as EthereumAddressWithChecksum}
      additionalData={{ tokenDisbursals: nEurTokenDisbursal }}
      onAccept={action("onAccept")}
    />
  ));
