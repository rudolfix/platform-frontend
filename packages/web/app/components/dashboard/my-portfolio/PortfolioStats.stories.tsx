import { TETOWithTokenData } from "@neufund/shared-modules";
import { convertToUlps } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { LoadingIndicator } from "../../shared/loading-indicator/LoadingIndicator";
import {
  PortfolioStatsErrorLayout,
  PortfolioStatsLayout,
  PortfolioStatsLayoutContainer,
  PortfolioStatsNoAssetsLayout,
} from "./PortfolioStats";

import tokenIcon from "../../../assets/img/nEUR_icon.svg";

const myAssets = ([
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "Storybook",
    equityTokenSymbol: "STR",
    tokenData: {
      balanceUlps: "100",
      balanceDecimals: "0",
      tokenPrice: "0.20",
    },
  },
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "React",
    equityTokenSymbol: "RCT",
    tokenData: {
      balanceUlps: "28",
      balanceDecimals: "0",
      tokenPrice: "3.14",
    },
  },
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "Number 3",
    equityTokenSymbol: "NO3",
    tokenData: {
      balanceUlps: "120",
      balanceDecimals: "0",
      tokenPrice: "4.20",
    },
  },
] as unknown) as TETOWithTokenData[];

const moreAssets = ([
  ...myAssets,
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "Number 4",
    equityTokenSymbol: "NO4",
    tokenData: {
      balance: "123",
      tokenPrice: convertToUlps("27.31"),
    },
  },
] as unknown) as TETOWithTokenData[];

storiesOf("NDS|Molecules/Dashboard/PortfolioStats", module)
  .add("default", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={"100"}>
      <PortfolioStatsLayout
        isVerifiedInvestor
        myAssetsEurEquivTotal={"1234"}
        myAssets={myAssets}
        goToPortfolio={action("GO_TO_PORTFOLIO")}
        goToProfile={action("GO_TO_PROFILE")}
      />
    </PortfolioStatsLayoutContainer>
  ))
  .add("more than 3", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={"100"}>
      <PortfolioStatsLayout
        isVerifiedInvestor
        myAssetsEurEquivTotal={"1234"}
        myAssets={moreAssets}
        goToPortfolio={action("GO_TO_PORTFOLIO")}
        goToProfile={action("GO_TO_PROFILE")}
      />
    </PortfolioStatsLayoutContainer>
  ))
  .add("no assets", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={undefined}>
      <PortfolioStatsNoAssetsLayout goToPortfolio={action("GO_TO_PORTFOLIO")} />
    </PortfolioStatsLayoutContainer>
  ))
  .add("has error", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={undefined}>
      <PortfolioStatsErrorLayout />
    </PortfolioStatsLayoutContainer>
  ))
  .add("loading", () => (
    <PortfolioStatsLayoutContainer myAssetsEurEquivTotal={undefined}>
      <LoadingIndicator />
    </PortfolioStatsLayoutContainer>
  ));
