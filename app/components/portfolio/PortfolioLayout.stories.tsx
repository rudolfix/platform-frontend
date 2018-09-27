import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";

import { PortfolioLayout } from "./PortfolioLayout";

import * as neuIcon from "../../assets/img/neu_icon.svg";
import { ETOStateOnChain } from "../../modules/public-etos/types";

const addDays = (date: Date, days: number) => {
  return date.setDate(date.getDate() + days);
};

storiesOf("PortfolioLayout", module)
  .add("with my assets", () => {
    const props: any = {
      myAssets: [
        {
          etoId: "eto-1",
          equityTokenImage: neuIcon,
          equityTokenName: "EXS",
          investorTicket: {
            equityTokenInt: new BigNumber(10000),
            equivEurUlps: new BigNumber(20),
            rewardNmkUlps: new BigNumber(0.5),
          },
          documents: {
            "document-hash": {
              ipfsHash: "document-hash",
              name: "document-link",
              documentType: "signed_investment_and_shareholder_agreement",
            },
          },
        },
        {
          etoId: "eto-1",
          equityTokenImage: neuIcon,
          equityTokenName: "TXA",
          investorTicket: {
            equityTokenInt: new BigNumber(1200),
            equivEurUlps: new BigNumber(12),
            rewardNmkUlps: new BigNumber(0.95),
          },
          documents: {
            "document-hash-1": {
              ipfsHash: "document-hash-1",
              name: "document-link",
              documentType: "reservation_and_acquisition_agreement",
            },
            "document-hash-2": {
              ipfsHash: "document-hash-2",
              name: "document-link",
              documentType: "approved_prospectus",
            },
          },
        },
      ],
      pendingAssets: [],
    };

    return <PortfolioLayout {...props} />;
  })
  .add("with pending assets", () => {
    const props: any = {
      pendingAssets: [
        {
          etoId: "eto-1",
          equityTokenImage: neuIcon,
          equityTokenName: "TXA",
          investorTicket: {
            equityTokenInt: new BigNumber(1200),
            equivEurUlps: new BigNumber(12),
            rewardNmkUlps: new BigNumber(0.95),
          },
          contract: {
            timedState: ETOStateOnChain.Whitelist,
            startOfStates: {
              [ETOStateOnChain.Signing]: addDays(new Date(), 5),
            },
          },
        },
        {
          etoId: "eto-1",
          equityTokenImage: neuIcon,
          equityTokenName: "RAW",
          investorTicket: {
            equityTokenInt: new BigNumber(15000),
            equivEurUlps: new BigNumber(120),
            rewardNmkUlps: new BigNumber(0.45),
          },
          contract: {
            timedState: ETOStateOnChain.Signing,
          },
        },
        {
          etoId: "eto-1",
          equityTokenImage: neuIcon,
          equityTokenName: "TEW",
          investorTicket: {
            equityTokenInt: new BigNumber(150000),
            equivEurUlps: new BigNumber(12000),
            rewardNmkUlps: new BigNumber(0.45),
          },
          contract: {
            timedState: ETOStateOnChain.Refund,
          },
        },
        {
          etoId: "eto-1",
          equityTokenImage: neuIcon,
          equityTokenName: "YUE",
          investorTicket: {
            equityTokenInt: new BigNumber(120000),
            equivEurUlps: new BigNumber(12000),
            rewardNmkUlps: new BigNumber(0.99),
          },
          contract: {
            timedState: ETOStateOnChain.Claim,
          },
        },
      ],
      myAssets: [],
    };

    return <PortfolioLayout {...props} />;
  });
