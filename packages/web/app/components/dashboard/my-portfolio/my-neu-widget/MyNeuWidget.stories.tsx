import { convertToUlps, Q18 } from "@neufund/shared";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { LoadingIndicator } from "../../../shared/loading-indicator/LoadingIndicator";
import { MyNeuWidgetLayout, MyNeuWidgetLayoutWrapper } from "./MyNeuWidget";
import { MyNeuWidgetError } from "./MyNeuWidgetError";

storiesOf("NDS|Molecules/Dashboard/MyNeuWidget", module)
  .add("with funds", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetLayout
        availablePayout={false}
        pendingPayout={false}
        tokensDisbursalEurEquiv={"0"}
        balanceNeu={Q18.mul("123").toString()}
        balanceEur="5947506"
        acceptCombinedPayout={action("ACCEPT_PAYOUT")}
        tokensDisbursal={[]}
      />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("with available payout", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetLayout
        availablePayout={true}
        pendingPayout={false}
        tokensDisbursalEurEquiv={convertToUlps("123.24")}
        balanceNeu={Q18.mul("123").toString()}
        balanceEur="5947506"
        acceptCombinedPayout={action("ACCEPT_PAYOUT")}
        tokensDisbursal={[]}
      />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("with pending payout", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetLayout
        availablePayout={false}
        pendingPayout={true}
        tokensDisbursalEurEquiv={convertToUlps("123.24")}
        balanceNeu={Q18.mul("123").toString()}
        balanceEur="5947506"
        acceptCombinedPayout={action("ACCEPT_PAYOUT")}
        tokensDisbursal={[]}
      />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("loading", () => (
    <MyNeuWidgetLayoutWrapper>
      <LoadingIndicator />
    </MyNeuWidgetLayoutWrapper>
  ))
  .add("error", () => (
    <MyNeuWidgetLayoutWrapper>
      <MyNeuWidgetError
        error={
          <>
            Something went wrong. <br />
            Please reload the page.
          </>
        }
      />
    </MyNeuWidgetLayoutWrapper>
  ));
