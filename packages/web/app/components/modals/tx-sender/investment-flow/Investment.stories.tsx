import { EETOStateOnChain, TEtoWithCompanyAndContractTypeChecked } from "@neufund/shared-modules";
import { convertFromUlps } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { testEto } from "../../../../../test/fixtures";
import {
  EInvestmentErrorState,
  EInvestmentType,
} from "../../../../modules/investment-flow/reducer";
import { withModalBody } from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { injectIntlHelpers } from "../../../shared/hocs/injectIntlHelpers.unsafe";
import { InvestmentSelectionComponent } from "./Investment";
import { wallets } from "./InvestmentTypeSelector.stories";
import { EInvestmentCurrency } from "./utils";

const Investment = injectIntlHelpers(InvestmentSelectionComponent);

const testEtoInWhitelist = {
  ...testEto,
  contract: {
    ...testEto.contract!,
    timedState: EETOStateOnChain.Whitelist,
  },
} as TEtoWithCompanyAndContractTypeChecked;

const props = {
  wallets: wallets,
  changeEthValue: action("changeEthValue"),
  changeEuroValue: action("changeEuroValue"),
  changeInvestmentType: action("changeInvestmentType"),
  equityTokenCount: "1234",
  ethValue: "1234123412341232341234",
  eto: testEtoInWhitelist,
  euroValue: convertFromUlps("123412341234123412341234").toString(),
  gasCostEth: "123412323412341234",
  gasCostEuro: convertFromUlps("12341234123412341234").toString(),
  etherPriceEur: convertFromUlps("123412341234123412341234").toString(),
  eurPriceEther: "0.123412341234123412341234",
  investEntireBalance: action("investEntireBalance"),
  investmentType: EInvestmentType.Eth,
  investmentCurrency: EInvestmentCurrency.ETH,
  minTicketEth: "12341234123412341234",
  minTicketEur: "1234",
  maxTicketEur: "123456",
  readyToInvest: false,
  showTokens: true,
  sendTransaction: action("sendTransaction"),
  hasPreviouslyInvested: true,
  startUpgradeFlow: action("startUpgradeFlow"),
  etoTokenGeneralDiscounts: {
    whitelistDiscount: "0.35",
    discountedTokenPrice: convertFromUlps("296633323000000000").toString(),
    publicDiscountFrac: 0.25,
    publicDiscount: "339009512000000000",
  },
  etoTokenPersonalDiscount: {
    whitelistDiscountAmountLeft: convertFromUlps("-1.043240344598e+23").toString(),
    discountedTokenPrice: "0",
    whitelistDiscount: "0.5",
  },
  etoTokenStandardPrice: 0.6,
};

storiesOf("Investment/Form", module)
  .addDecorator(withModalBody())
  .addDecorator(story => (
    <Formik initialValues={{}} onSubmit={() => {}}>
      {story}
    </Formik>
  ))
  .add("default", () => <Investment {...props} />)
  .add("default with error", () => (
    <Investment {...props} errorState={EInvestmentErrorState.ExceedsWalletBalance} />
  ));
