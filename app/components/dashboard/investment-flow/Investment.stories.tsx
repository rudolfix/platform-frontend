import { storiesOf } from "@storybook/react";
import { Formik, withFormik } from "formik";
import * as React from "react";
import { InvestmentSelectionForm } from "./Investment";


const wallets = [{
  balance: 300, id: 'foo', name: 'lalala'
}, {
  balance: 400, id: 'bar', name: 'fufufu'
}]

storiesOf("InvestmentSelectionForm", module)
  .add("default", () => (
    <Formik initialValues={{ wallet: 'bar', amount: 0 }} onSubmit={(vals) => { console.log(vals) }}>
      {(props) => (
        <InvestmentSelectionForm {...props as any} wallets={wallets} />
      )}
    </Formik>
  ))
