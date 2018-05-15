import { action } from "@storybook/addon-actions";

import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoRaisedAmount } from "./EtoRaisedAmount";

const chartBarData = {
  labels: ["Lorem", "Ipsum", "Dit", "Sit", "Amet", "Blah", "Lorem", "Ipsum"],
  datasets: [
    {
      data: [130, 50, 20, 40, 50, 12, 100, 87],
      backgroundColor: [
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
        "#394651",
      ],
    },
  ],
};

storiesOf("EtoRaisedAmount", module).add("default", () => (
  <EtoRaisedAmount
    firstTransactionTime="yesterday"
    lastTransactionTime="yesterday"
    chartData={chartBarData}
  />
));
