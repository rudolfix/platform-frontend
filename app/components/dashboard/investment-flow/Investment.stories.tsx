import { storiesOf } from "@storybook/react";
import { Formik, withFormik } from "formik";
import * as React from "react";
import { InvestmentSelectionForm } from "./Investment";


storiesOf("InvestmentSelectionForm", module)
  .add("default", () => (
    <Formik initialValues={{amount: 300}} onSubmit={() => {}}>
      <InvestmentSelectionForm stateValues={{ amount: 300 }} />
    </Formik>
  ))
