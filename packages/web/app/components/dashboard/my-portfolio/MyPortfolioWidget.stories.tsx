import { storiesOf } from "@storybook/react";
import * as React from "react";

import { mockedStore } from "../../../../test/fixtures/mockedStore";
import { EKycRequestStatus } from "../../../lib/api/kyc/KycApi.interfaces";
import { IAppState } from "../../../store";
import { withStore } from "../../../utils/react-connected-components/storeDecorator.unsafe";
import { MyPortfolioWidget } from "./MyPortfolioWidget";

const errorState = {
  wallet: {
    error: "Error",
  },
  eto: {
    displayOrder: [],
  },
};

const defaultState = ({
  ...mockedStore,
  kyc: {
    claims: {
      isVerified: true,
    },
    status: {
      status: EKycRequestStatus.ACCEPTED,
    },
  },
  investorTickets: {
    incomingPayouts: {
      loading: false,
      error: false,
      data: {
        euroTokenIncomingPayoutValue: "1.1000012812e+23",
        etherTokenIncomingPayoutValue: "128128120000000000000",
        snapshotDate: 1580601600,
      },
    },
    tokensDisbursal: {
      loading: false,
      error: false,
      data: [
        {
          token: "eur_t",
          amountToBeClaimed: "984609705509027210028",
          totalDisbursedAmount: "2.912595230000000001e+23",
          amountEquivEur: "984609705509027210028",
          timeToFirstDisbursalRecycle: 1706757526000,
        },
        {
          token: "eth",
          amountToBeClaimed: "560514573245763224",
          totalDisbursedAmount: "165807026200000000000",
          amountEquivEur: "97078346877766094590.21980140173352",
          timeToFirstDisbursalRecycle: 1706757526000,
        },
      ],
    },
  },
} as unknown) as IAppState;

const stateNoKyc = { ...defaultState, kyc: undefined };

storiesOf("NDS|Organisms/Dashboard/MyPortfolioWidget", module)
  .add("loading", () => <MyPortfolioWidget />)
  .add("error", () => withStore(errorState)(() => <MyPortfolioWidget />))
  .add("default", () => withStore(defaultState)(() => <MyPortfolioWidget />))
  .add("no kyc", () => withStore(stateNoKyc)(() => <MyPortfolioWidget />));
