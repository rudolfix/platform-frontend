import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoOverviewStatus } from "./EtoOverviewStatus";

const props = {
  tokenName: "token name",
  tokenSymbol: "token symbol",
  tokenImage: {
    srcSet: {
      "1x": "",
    },
    alt: "token image alt",
  },
  termSheet: true,
  prospectusApproved: true,
  smartContractOnchain: true,
  preMoneyValuation: "pre money valuation",
  investmentAmount: "investment amount",
  newSharesGenerated: "new shares generated",
  equityTokenPrice: "Equity Token Price",
  raisedAmount: "2000",
  numberOfInvestors: 200,
  timeToClaim: 12,
  isPayoutEnabled: false,
};

storiesOf("Eto/OverviewStatus", module)
  .add("status: campaigning - back now", () => (
    <EtoOverviewStatus
      {...props}
      campaigningWidget={{
        amountBacked: "amountBacked",
        investorsBacked: 22,
        investorsLimit: 500,
        wasBacked: false,
        isLoggedIn: true,
        isActivated: true,
        quote: "Lorem ipsum",
      }}
      status="campaigning"
    />
  ))
  .add("status: campaigning - change", () => (
    <EtoOverviewStatus
      {...props}
      campaigningWidget={{
        amountBacked: "amountBacked",
        investorsBacked: 22,
        investorsLimit: 500,
        wasBacked: true,
        isLoggedIn: true,
        isActivated: true,
        quote: "Lorem ipsum",
      }}
      status="campaigning"
    />
  ))
  .add("status: campaigning - logged in and inactive", () => (
    <EtoOverviewStatus
      {...props}
      campaigningWidget={{
        amountBacked: "amountBacked",
        investorsBacked: 22,
        investorsLimit: 500,
        wasBacked: true,
        isLoggedIn: true,
        isActivated: false,
        quote: "Lorem ipsum",
      }}
      status="campaigning"
    />
  ))
  .add("status: campaigning - logged out", () => (
    <EtoOverviewStatus
      {...props}
      campaigningWidget={{
        amountBacked: "amountBacked",
        investorsBacked: 22,
        investorsLimit: 500,
        wasBacked: true,
        isLoggedIn: false,
        isActivated: true,
        quote: "Lorem ipsum",
      }}
      status="campaigning"
    />
  ))
  .add("status: pre-eto", () => <EtoOverviewStatus {...props} status="pre-eto" />)
  .add("status: public-eto", () => (
    <EtoOverviewStatus
      {...props}
      status="public-eto"
      publicWidget={{
        endInDays: 5,
        investorsBacked: 10,
        tokensGoal: 20,
        raisedTokens: 1,
        raisedETH: 1000,
        raisedNEUR: 10000,
      }}
    />
  ))
  .add("status: in-signing", () => (
    <EtoOverviewStatus
      {...props}
      status="in-signing"
      publicWidget={{
        endInDays: 5,
        investorsBacked: 10,
        tokensGoal: 20,
        raisedTokens: 1,
        raisedETH: 10000,
        raisedNEUR: 10000,
      }}
    />
  ))
  .add("status: claim", () => <EtoOverviewStatus {...props} timeToClaim={0} status="claim" />)
  .add("status: refund", () => <EtoOverviewStatus {...props} timeToClaim={12} status="refund" />);
