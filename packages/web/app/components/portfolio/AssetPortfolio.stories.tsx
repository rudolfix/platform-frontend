import { ITokenDisbursal } from "@neufund/shared-modules";
import { convertFromUlps, ECurrency } from "@neufund/shared-utils";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { AssetPortfolio } from "./AssetPortfolio";

const tokensDisbursal: readonly ITokenDisbursal[] = [
  {
    token: ECurrency.EUR_TOKEN,
    amountToBeClaimed: "214741398295153194461",
    totalDisbursedAmount: "2.912595230000000001e+23",
    tokenDecimals: 18,
    amountEquivEur: convertFromUlps("214741398295153194461").toString(),
    timeToFirstDisbursalRecycle: 1708571924000,
  },
  {
    token: ECurrency.ETH,
    amountToBeClaimed: "122247102125993321",
    totalDisbursedAmount: "165807026200000000000",
    tokenDecimals: 18,
    amountEquivEur: convertFromUlps("20454385127721202469.72").toString(),
    timeToFirstDisbursalRecycle: 1708571924000,
  },
];

storiesOf("Portfolio/AssetPortfolio", module)
  .add("default", () => (
    <AssetPortfolio
      tokensDisbursal={tokensDisbursal}
      isVerifiedInvestor={true}
      tokenDisbursalIsLoading={false}
      tokenDisbursalError={false}
      tokensDisbursalEurEquivTotal={"239.95"}
      tokensDisbursalEurEquivTotalDisbursed={"332635.65"}
    />
  ))
  .add("loading", () => (
    <AssetPortfolio
      tokensDisbursal={tokensDisbursal}
      isVerifiedInvestor={true}
      tokenDisbursalIsLoading={true}
      tokenDisbursalError={false}
      tokensDisbursalEurEquivTotal={"239.95"}
      tokensDisbursalEurEquivTotalDisbursed={"332635.65"}
    />
  ))
  .add("with error", () => (
    <AssetPortfolio
      tokensDisbursal={tokensDisbursal}
      isVerifiedInvestor={true}
      tokenDisbursalIsLoading={false}
      tokenDisbursalError={true}
      tokensDisbursalEurEquivTotal={"239.95"}
      tokensDisbursalEurEquivTotalDisbursed={"332635.65"}
    />
  ))
  .add("no payouts", () => (
    <AssetPortfolio
      tokensDisbursal={[]}
      isVerifiedInvestor={true}
      tokenDisbursalIsLoading={false}
      tokenDisbursalError={false}
      tokensDisbursalEurEquivTotal={"239.95"}
      tokensDisbursalEurEquivTotalDisbursed={"332635.65"}
    />
  ));
