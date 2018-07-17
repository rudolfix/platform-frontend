import { storiesOf } from "@storybook/react";
import { Formik, withFormik } from "formik";
import * as React from "react";
import { InvestmentSummary } from "./Summary";


const data: any = {

}

storiesOf("InvestmentSummary", module)
  .add("default", () => (
    <InvestmentSummary investmentData={data} submit={() => {}}/>
  ))
