import { EETOStateOnChain, IInvestorTicket, TETOWithInvestorTicket } from "@neufund/shared-modules";
import { convertToUlps } from "@neufund/shared-utils";
import { storiesOf } from "@storybook/react";
import * as React from "react";
import { FormattedMessage } from "react-intl-phraseapp";

import { testEto } from "../../../test/fixtures";
import { mockedStore } from "../../../test/fixtures/mockedStore";
import { withStore } from "../../utils/react-connected-components/storeDecorator.unsafe";
import { LoadingIndicator } from "../shared/loading-indicator";
import { WarningAlert } from "../shared/WarningAlert";
import {
  PortfolioReservedAssetsContainer,
  PortfolioReservedAssetsLayout,
  PortfolioReservedAssetsNoAssets,
} from "./PortfolioReservedAssets";

const eto = {
  ...testEto,
  contract: {
    ...testEto.contract,
    timedState: EETOStateOnChain.Payout,
  },
  investorTicket: {
    equivEur: "738.46",
    rewardNmkUlps: convertToUlps("1234.2212"),
    equityTokenInt: "2280",
    tokenPrice: "0.373",
  } as IInvestorTicket,
} as TETOWithInvestorTicket;

const secondEto = {
  ...eto,
  equityTokenName: "Storybook",
  equityTokenSymbol: "STR",
  investorTicket: {
    ...eto.investorTicket,
    equivEur: "12452.46",
    equityTokenInt: "123422",
    rewardNmkUlps: convertToUlps("4537.235"),
  },
} as TETOWithInvestorTicket;

const reservedAssetsData = {
  pendingAssets: [eto, secondEto],
  pendingAssetsTotalInvested: "10436170.73",
  pendingAssetsTotalQuantity: "21830965",
  pendingAssetsAveragePrice: "0.3730",
  pendingAssetsTotalReward: convertToUlps("31875101.3922"),
  hasError: false,
};

storiesOf("Portfolio/PortfolioReservedAssets", module)
  .addDecorator(withStore(mockedStore))
  .add("default", () => (
    <PortfolioReservedAssetsContainer>
      <PortfolioReservedAssetsLayout {...reservedAssetsData} />
    </PortfolioReservedAssetsContainer>
  ))
  .add("no assets", () => (
    <PortfolioReservedAssetsContainer>
      <PortfolioReservedAssetsNoAssets />
    </PortfolioReservedAssetsContainer>
  ))
  .add("loading", () => (
    <PortfolioReservedAssetsContainer>
      <LoadingIndicator className="m-auto" />
    </PortfolioReservedAssetsContainer>
  ))
  .add("error", () => (
    <PortfolioReservedAssetsContainer>
      <WarningAlert data-test-id="my-neu-widget-error" className="m-auto">
        <FormattedMessage id="common.error" values={{ separator: " " }} />
      </WarningAlert>
    </PortfolioReservedAssetsContainer>
  ));
