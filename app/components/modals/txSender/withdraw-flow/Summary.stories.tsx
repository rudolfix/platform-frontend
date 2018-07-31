import { storiesOf } from "@storybook/react";
import * as React from "react";

import { WithdrawSummary } from "./Summary";
import { ITxData } from "../../../../modules/tx/sender/reducer";

const txData: ITxData = {
  to: "0xfb6916095ca1df60bb79ce92ce3ea74c37c5d359",
  value: "12345", // in wei
  gas: "12000",
  gasPrice: "50000",
  from: "0x8e75544b848f0a32a1ab119e3916ec7138f3bed2",
};

storiesOf("Summary", module).add("default", () => <WithdrawSummary {...txData} />);
