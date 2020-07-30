import { convertFromUlps, ETH_DECIMALS, toEquityTokenSymbol } from "@neufund/shared-utils";
import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import moment from "moment";
import * as React from "react";

import { EInvestmentType } from "../../../../modules/investment-flow/reducer";
import {
  withMockedDate,
  withModalBody,
} from "../../../../utils/react-connected-components/storybookHelpers.unsafe";
import { InvestmentSuccessComponent } from "./Success";

import tokenIcon from "../../../../assets/img/token_icon.svg";

const dummyNow = new Date("10/3/2019");
const date = moment.utc(dummyNow).subtract(1, "day");

const props = {
  txHash: "0x123434562134asdf2412341234adf12341234",
  additionalData: {
    eto: {
      companyName: "X company",
      etoId: "0x123434562134asdf2412341234adf12341234",
      preMoneyValuationEur: 0,
      existingShareCapital: 0,
      equityTokensPerShare: 10,
      sharePrice: 1000 / (10 * 10),
      equityTokenInfo: {
        equityTokenSymbol: toEquityTokenSymbol("QTT"),
        equityTokenImage: tokenIcon,
        equityTokenName: "Quintessence",
      },
    },
    investmentType: EInvestmentType.NEur,
    investmentEth: "12345678900000000000",
    investmentEur: convertFromUlps("12345678900000000000000").toString(),
    gasCostEth: "2000000000000000",
    equityTokens: "500",
    estimatedReward: "40000000000000000000",
    etherPriceEur: "200",
    isIcbm: false,
    tokenDecimals: ETH_DECIMALS,
  },
  txTimestamp: date.valueOf(),
  goToPortfolio: action("goToPortfolio"),
};

storiesOf("Investment/Success", module)
  .addDecorator(withModalBody())
  .addDecorator(withMockedDate(dummyNow))
  .add("default", () => <InvestmentSuccessComponent {...props} />);
