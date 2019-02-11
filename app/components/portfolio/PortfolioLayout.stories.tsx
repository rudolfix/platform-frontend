import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withStore } from "../../utils/storeDecorator";
import { ECurrency } from "../shared/Money";
import { PortfolioLayout, TPortfolioLayoutProps } from "./PortfolioLayout";

const data: TPortfolioLayoutProps = {
  myAssets: [],
  pendingAssets: [],
  isRetailEto: false,
  walletAddress: "0x00000",
  tokensDisbursal: [
    {
      token: ECurrency.EUR_TOKEN,
      amountToBeClaimed: "11200657227385184",
      timeToFirstDisbursalRecycle: 1675062154000,
      totalDisbursedAmount: "364458900000000000",
    },
    {
      token: ECurrency.ETH,
      amountToBeClaimed: "01200657227385184",
      timeToFirstDisbursalRecycle: 1675062154000,
      totalDisbursedAmount: "064458900000000000",
    },
  ],
};

storiesOf("Portfolio/PortfolioLayout", module)
  .addDecorator(withStore({}))
  .add("default", () => <PortfolioLayout {...data} />);
