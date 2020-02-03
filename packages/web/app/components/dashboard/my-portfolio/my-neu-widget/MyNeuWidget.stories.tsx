import { convertToUlps } from "@neufund/shared";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { mockedStore } from "../../../../../test/fixtures/mockedStore";
import { IAppState } from "../../../../store";
import { withStore } from "../../../../utils/react-connected-components/storeDecorator.unsafe";
import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { MyNeuWidgetLayout, MyNeuWidgetLayoutWrapper } from "./MyNeuWidget";
import { MyNeuWidgetError } from "./MyNeuWidgetError";

const tokensDisbursal = {
  tokensDisbursal: {
    loading: false,
    error: false,
    data: [
      {
        token: "eur_t",
        amountToBeClaimed: "984609705509027210028",
        totalDisbursedAmount: "2.912595230000000001e+23",
        amountEquivEur: "984609705509027210028",
        timeToFirstDisbursalRecycle: 1706843924000,
      },
      {
        token: "eth",
        amountToBeClaimed: "560514573245763224",
        totalDisbursedAmount: "165807026200000000000",
        amountEquivEur: "96483084153784861454.86614639805432",
        timeToFirstDisbursalRecycle: 1706843924000,
      },
    ],
  },
};

const incomingPayouts = {
  incomingPayouts: {
    loading: false,
    error: false,
    data: {
      euroTokenIncomingPayoutValue: "1.100012812e+23",
      etherTokenIncomingPayoutValue: "128128120000000000000",
      snapshotDate: 1580688000,
    },
  },
};

const payoutState = ({
  ...mockedStore,
  investorTickets: { ...mockedStore.investorTickets, ...tokensDisbursal },
} as unknown) as IAppState;
const incomingPayoutState = ({
  ...mockedStore,
  investorTickets: { ...mockedStore.investorTickets, ...incomingPayouts },
} as unknown) as IAppState;

storiesOf("NDS|Molecules/Dashboard/MyNeuWidget", module)
  .add("with funds", () =>
    withStore(mockedStore)(() => (
      <MyNeuWidgetLayoutWrapper>
        <MyNeuWidgetLayout
          availablePayout={false}
          pendingPayout={false}
          balanceNeu={convertToUlps("1234")}
          balanceEur={convertToUlps("1234")}
          acceptCombinedPayout={action("ACCEPT_PAYOUT")}
        />
      </MyNeuWidgetLayoutWrapper>
    )),
  )
  .add("with available payout", () =>
    withStore(payoutState)(() => (
      <MyNeuWidgetLayoutWrapper>
        <MyNeuWidgetLayout
          availablePayout={true}
          pendingPayout={false}
          balanceNeu={convertToUlps("1234")}
          balanceEur={convertToUlps("1234")}
          acceptCombinedPayout={action("ACCEPT_PAYOUT")}
        />
      </MyNeuWidgetLayoutWrapper>
    )),
  )
  .add("with pending payout", () =>
    withStore(incomingPayoutState)(() => (
      <MyNeuWidgetLayoutWrapper>
        <MyNeuWidgetLayout
          availablePayout={false}
          pendingPayout={true}
          balanceNeu={convertToUlps("1234")}
          balanceEur={convertToUlps("1234")}
          acceptCombinedPayout={action("ACCEPT_PAYOUT")}
        />
      </MyNeuWidgetLayoutWrapper>
    )),
  )
  .add("loading", () => (
    <MyNeuWidgetLayoutWrapper>
      <LoadingIndicator />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("error", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetError error={"Random error passed from saga"} />
    </MyNeuWidgetLayoutWrapper>
  ));
