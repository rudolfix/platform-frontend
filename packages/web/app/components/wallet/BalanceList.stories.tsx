import { action } from "@storybook/addon-actions";
import { storiesOf } from "@storybook/react";
import * as React from "react";

import { EBalanceViewType, TBalanceData } from "../../modules/wallet-view/types";
import { BalanceList } from "./BalanceList";
import { createBalanceActions, createBalanceUiData } from "./utils";

const dummyDispatch = (a: { type: string }) => action(a.type)();

const balanceData: TBalanceData[] = [
  {
    amount: "2000312217000000000",
    name: EBalanceViewType.ETH,
    euroEquivalentAmount: "389864625857099778516.40584",
  },
  {
    amount: "100000000000000000000",
    name: EBalanceViewType.ICBM_ETH,
    euroEquivalentAmount: "1.9490188708730952e+22",
  },
  {
    amount: "100000000000000000000",
    name: EBalanceViewType.LOCKED_ICBM_ETH,
    euroEquivalentAmount: "1.9490188708730952e+22",
  },
  {
    amount: "100000000000000000000",
    name: EBalanceViewType.NEUR,
    euroEquivalentAmount: "1.9490188708730952e+22",
  },
  {
    amount: "100000000000000000000",
    name: EBalanceViewType.ICBM_NEUR,
    euroEquivalentAmount: "1.9490188708730952e+22",
  },
  {
    amount: "100000000000000000000",
    name: EBalanceViewType.LOCKED_ICBM_NEUR,
    euroEquivalentAmount: "1.9490188708730952e+22",
  },
];

const balanceActions = createBalanceActions(dummyDispatch);
const balances = balanceData.map(b => createBalanceUiData(b, balanceActions));

storiesOf("BalanceList", module).add("default", () => <BalanceList balances={balances} />);
