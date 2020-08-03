import { storiesOf } from "@storybook/react";
import * as React from "react";

import { testEto } from "../../../test/fixtures";
import { ETOFundraisingStatisticsLayout } from "./ETOFundraisingStatistics";

storiesOf("ETOFundraisingStatistics", module).add("default", () => (
  <ETOFundraisingStatisticsLayout
    eto={testEto}
    etherTokenEurEquiv={"623.42"}
    averageInvestmentEur={"125552.21"}
  />
));
