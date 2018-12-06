import { storiesOf } from "@storybook/react";
import BigNumber from "bignumber.js";
import * as React from "react";
import { Row } from "reactstrap";

import { EtoState } from "../../lib/api/eto/EtoApi.interfaces";
import { EETOStateOnChain, TEtoWithCompanyAndContract } from "../../modules/public-etos/types";
import { withStore } from "../../utils/storeDecorator";
import { EtoDashboardStateViewComponent } from "./EtoDashboard";

// tslint:disable-next-line:no-object-literal-type-assertion
const eto = {
  etoId: "0x123434562134asdf2412341234adf12341234",
  companyId: "asdf",
  previewCode: "1234",
  preMoneyValuationEur: 10000,
  existingCompanyShares: 10,
  equityTokensPerShare: 10,
  publicDiscountFraction: 0.2,
  whitelistDiscountFraction: 0.3,
  equityTokenName: "TokenName",
  equityTokenSymbol: "TKN",
  company: { brandName: "BrandName" },
  contract: {
    timedState: EETOStateOnChain.Whitelist,
    totalInvestment: { totalInvestors: new BigNumber("123"), totalTokensInt: new BigNumber("234") },
  },
} as TEtoWithCompanyAndContract;

const state = {
  etoState: EtoState.ON_CHAIN,
  canEnableBookbuilding: false,
  isTermSheetSubmitted: true,
  isOfferingDocumentSubmitted: true,
  shouldViewSubmissionSection: true,
  previewCode: eto.previewCode,
  isRetailEto: true,
};

storiesOf("ETO-Flow/Dashboard/StateView", module)
  .addDecorator(
    withStore({
      publicEtos: {
        publicEtos: { [eto.previewCode]: eto },
        companies: { [eto.companyId]: eto.company },
        contracts: { [eto.previewCode]: eto.contract },
      },
    }),
  )
  .add("State OnChain", () => (
    <Row className="row-gutter-top">
      <EtoDashboardStateViewComponent {...state} />
    </Row>
  ));
