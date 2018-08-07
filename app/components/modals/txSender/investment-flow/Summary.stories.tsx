import { storiesOf } from "@storybook/react";
import { Formik, withFormik } from "formik";
import * as React from "react";

import { InvestmentSummary } from "./Summary";

const data: any = {
  companyName: "X company",
  tokenPrice: "0.0034 ETH",
  etoAddress: "0x123434562134asdf2412341234adf12341234",
  investment: "1.23 ETH",
  transactionCost: "0.02 ETH",
  equityTokens: "500.12345 Tokens",
  estimatedReward: "4 NEU",
  transactionValue: "2 ETH",
};

storiesOf("InvestmentSummary", module).add("default", () => (
  <InvestmentSummary investmentData={data} agreementUrl="somePDF.pdf" submit={() => {}} />
));
