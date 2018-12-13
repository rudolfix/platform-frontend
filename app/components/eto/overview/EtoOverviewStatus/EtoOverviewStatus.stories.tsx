import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoOverviewStatusLayout } from ".";
import { testEto } from "../../../../../test/fixtures";
import {
  EETOStateOnChain,
  TEtoWithCompanyAndContract,
} from "../../../../modules/public-etos/types";
import { withStore } from "../../../../utils/storeDecorator";
import { EtoWidgetContext } from "../../EtoWidgetView";

const eto: TEtoWithCompanyAndContract = {
  ...testEto,
  preMoneyValuationEur: 10000,
  existingCompanyShares: 10,
  equityTokensPerShare: 10,
  publicDiscountFraction: 0.2,
  whitelistDiscountFraction: 0.3,
  equityTokenName: "TokenName",
  equityTokenSymbol: "TKN",
  company: { ...testEto.company, brandName: "BrandName" },
  contract: {
    ...testEto.contract!,
    timedState: EETOStateOnChain.Whitelist,
  },
};

storiesOf("ETO/EtoOverviewStatus", module)
  .addDecorator(
    withStore({
      publicEtos: {
        publicEtos: { [eto.previewCode]: eto },
        companies: { [eto.companyId]: eto.company },
        contracts: { [eto.previewCode]: eto.contract },
      },
    }),
  )
  .add("default", () => (
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={eto}
        isAuthorized={true}
        isEligibleToPreEto={true}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("with whitelist discount", () => (
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={eto}
        isAuthorized={true}
        isEligibleToPreEto={true}
        isPreEto={true}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ))
  .add("without discount", () => (
    <EtoWidgetContext.Provider value={eto.previewCode}>
      <EtoOverviewStatusLayout
        eto={{ ...eto, publicDiscountFraction: 0 }}
        isAuthorized={true}
        isEligibleToPreEto={true}
        maxCapExceeded={false}
        navigateToEto={() => {}}
        openInNewWindow={() => {}}
      />
    </EtoWidgetContext.Provider>
  ));
