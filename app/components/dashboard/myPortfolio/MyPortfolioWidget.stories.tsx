import { storiesOf } from "@storybook/react";
import { Form, Formik } from "formik";
import * as React from "react";

import { Q18 } from "../../../config/constants";
import { MyPortfolioWidgetComponent } from "./MyPortfolioWidget";

storiesOf("MyPortfolioWidget", module)
  .add("loading", () => <MyPortfolioWidgetComponent isLoading />)
  .add("loaded", () => (
    <MyPortfolioWidgetComponent
      isLoading={false}
      lockedAmount={{
        balanceEur: "12312352413",
        balanceNeu: `123${Q18.toString()}`,
        isIcbmWalletConnected: true,
      }}
    />
  ))
  .add("loaded, no funds", () => (
    <MyPortfolioWidgetComponent
      isLoading={false}
      lockedAmount={{ balanceEur: "0", balanceNeu: "0", isIcbmWalletConnected: true }}
    />
  ));
