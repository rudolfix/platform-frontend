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
};

storiesOf("Eto/OverviewStatus", module)
  .add("status: campaigning", () => (
    <EtoOverviewStatus
      {...props}
      campaigningWidget={{ amountBacked: "amountBacked", investorsBacked: 22 }}
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
      }}
    />
  ))
  .add("status: claim", () => <EtoOverviewStatus {...props} status="claim" />)
  .add("status: refund", () => <EtoOverviewStatus {...props} status="refund" />);
