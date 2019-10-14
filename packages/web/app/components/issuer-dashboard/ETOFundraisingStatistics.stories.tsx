import { storiesOf } from "@storybook/react";
import React from "react";

import { testEto } from "../../../test/fixtures";
import { convertToBigInt } from "../../utils/NumberUtils";
import { ETOFundraisingStatisticsLayout } from "./ETOFundraisingStatistics";

storiesOf("ETOFundraisingStatistics", module).add("default", () => (
  <ETOFundraisingStatisticsLayout
    eto={testEto}
    etherTokenEurEquivUlps={convertToBigInt("623.42")}
    averageInvestmentEurUlps={convertToBigInt("125552.21")}
  />
));
