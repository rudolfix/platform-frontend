import { action } from "@storybook/addon-actions";

import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EtoOverviewStatus } from "./EtoOverviewStatus";

const tokenIcon = "../../../assets/img/nEUR_icon.svg";


storiesOf("EtoOverviewStatus", module).add("default", () => (
  <EtoOverviewStatus
    cap="HARD CAP: 750M EDT"
    duration="22.02.2018 to 22.5.2019"
    tokensSupply="50000000"
    tokenName="ABC"
    tokenImg={tokenIcon}
    status="book-building"
  />
));
