import { convertToUlps } from "@neufund/shared";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import {
  ELoadingIndicator,
  LoadingIndicator,
} from "../../../shared/loading-indicator/LoadingIndicator";
import { MyNeuWidgetLayout, MyNeuWidgetLayoutWrapper } from "./MyNeuWidget";
import { MyNeuWidgetError } from "./MyNeuWidgetError";

storiesOf("NDS|Molecules/Dashboard/MyNeuWidget", module)
  .add("with funds", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetLayout
        isPayoutAvailable={false}
        isPayoutPending={false}
        balanceNeu={convertToUlps("1234")}
        balanceEur={convertToUlps("1234")}
        tokensDisbursalEurEquiv={convertToUlps("1234")}
        incomingPayoutEurEquiv={convertToUlps("1234")}
        goToPortfolio={action("goToPortfolio")}
        loadPayoutsData={action("loadPayoutsData")}
      />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("with available payout", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetLayout
        isPayoutAvailable={true}
        isPayoutPending={false}
        balanceNeu={convertToUlps("1234")}
        balanceEur={convertToUlps("1234")}
        tokensDisbursalEurEquiv={convertToUlps("1234")}
        incomingPayoutEurEquiv={convertToUlps("1234")}
        goToPortfolio={action("goToPortfolio")}
        loadPayoutsData={action("loadPayoutsData")}
      />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("with pending payout", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetLayout
        isPayoutAvailable={false}
        isPayoutPending={true}
        balanceNeu={convertToUlps("1234")}
        balanceEur={convertToUlps("1234")}
        tokensDisbursalEurEquiv={convertToUlps("1234")}
        incomingPayoutEurEquiv={convertToUlps("1234")}
        goToPortfolio={action("goToPortfolio")}
        loadPayoutsData={action("loadPayoutsData")}
      />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("loading", () => (
    <MyNeuWidgetLayoutWrapper>
      <LoadingIndicator type={ELoadingIndicator.PULSE_WHITE} className="m-auto" />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("error", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetError />
    </MyNeuWidgetLayoutWrapper>
  ));
