import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { InvestmentSelectionForm } from "./Investment";

const wallets = [
  {
    balanceEth: "30000000000000000000",
    id: "foo",
    name: "ICBM Wallet",
  },
  {
    balanceEth: "40000000000000000000",
    balanceEur: "45600000000000000000",
    id: "bar",
    name: "Light Wallet",
  },
];

storiesOf("InvestmentSelectionForm", module).add("default", () => (
  <Formik initialValues={{ wallet: "bar", amount: 0 }} onSubmit={() => {}}>
    {(props: any) => <InvestmentSelectionForm {...props} wallets={wallets} />}
  </Formik>
));
