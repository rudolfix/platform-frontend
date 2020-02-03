import { convertToUlps } from "@neufund/shared";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { TETOWithTokenData } from "../../modules/investor-portfolio/types";
import {
  PortfolioStatsErrorLayout,
  PortfolioStatsLayout,
  PortfolioStatsLoadingLayout,
  PortfolioStatsNoAssetsLayout,
  PortfolioStatsNoKYCLayout,
} from "./PortfolioStats";

import tokenIcon from "../../assets/img/nEUR_icon.svg";

const myAssets = ([
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "Storybook",
    equityTokenSymbol: "STR",
    tokenData: {
      balance: "100",
      tokenPrice: convertToUlps("0.20"),
    },
  },
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "React",
    equityTokenSymbol: "RCT",
    tokenData: {
      balance: "28",
      tokenPrice: convertToUlps("3.14"),
    },
  },
  {
    equityTokenImage: tokenIcon,
    equityTokenName: "Number 3",
    equityTokenSymbol: "NO3",
    tokenData: {
      balance: "120",
      tokenPrice: convertToUlps("4.20"),
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
    <PortfolioStatsLayout
      isVerifiedInvestor={true}
      myAssetsEurEquivTotal={convertToUlps("1234")}
      myAssets={myAssets}
      goToPortfolio={action("GO_TO_PORTFOLIO")}
      goToProfile={action("GO_TO_PROFILE")}
    />
  ))
  .add("more than 3", () => (
    <PortfolioStatsLayout
      isVerifiedInvestor={true}
      myAssetsEurEquivTotal={convertToUlps("1234")}
      myAssets={moreAssets}
      goToPortfolio={action("GO_TO_PORTFOLIO")}
      goToProfile={action("GO_TO_PROFILE")}
    />
  ))
  .add("is not verified", () => <PortfolioStatsNoKYCLayout goToProfile={action("GO_TO_PROFILE")} />)
  .add("no assets", () => (
    <PortfolioStatsNoAssetsLayout goToPortfolio={action("GO_TO_PORTFOLIO")} />
  ))
  .add("has error", () => <PortfolioStatsErrorLayout />)
  .add("loading", () => <PortfolioStatsLoadingLayout />);
