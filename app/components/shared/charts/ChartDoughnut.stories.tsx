import { storiesOf } from "@storybook/react";
import * as React from "react";

import { ChartDoughnut } from "./ChartDoughnut";

const data = {
  labels: ["ETH", "nEUR"],
  datasets: [
    {
      data: [100, 50],
      backgroundColor: ["#e3eaf5", "#394651"],
    },
  ],
};

storiesOf("Charts/Doughnut", module).add("default", () => <ChartDoughnut data={data} />);
