import { storiesOf } from "@storybook/react";
import * as React from "react";

import { withStore } from "../../utils/storeDecorator";
import { PortfolioLayout, TPortfolioLayoutProps } from "./PortfolioLayout";

const data: TPortfolioLayoutProps = {
  myAssets: [],
  pendingAssets: [],
  isRetailEto: false,
  walletAddress: "0x00000",
};

storiesOf("Portfolio/PortfolioLayout", module)
  .addDecorator(withStore({}))
  .add("default", () => <PortfolioLayout {...data} />);
