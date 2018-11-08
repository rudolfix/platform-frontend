import { storiesOf } from "@storybook/react";
import { Formik } from "formik";
import * as React from "react";

import { EtoEquityTokenInfoComponent } from "./EtoEquityTokenInfo";

const eto = {};
const loadingState = {
  loadingData: false,
  savingData: false,
  readonly: false,
  stateValues: eto,
  saveData: () => {},
};

storiesOf("ETO-Flow/Registration-forms", module).add("EtoEquityTokenInfo", () => (
  <Formik initialValues={eto} onSubmit={() => {}}>
    {props => <EtoEquityTokenInfoComponent {...props} {...loadingState} />}
  </Formik>
));
