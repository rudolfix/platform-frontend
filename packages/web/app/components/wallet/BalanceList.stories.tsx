import { convertFromUlps } from "@neufund/shared-utils";
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
    euroEquivalentAmount: convertFromUlps("389864625857099778516.40584").toString(),
  },
  {
    amount: "100000000000000000000",
    name: EBalanceViewType.ICBM_ETH,
    euroEquivalentAmount: convertFromUlps("1.9490188708730952e+22").toString(),
  },
  {
    amount: "100000000000000000000",
    name: EBalanceViewType.LOCKED_ICBM_ETH,
    euroEquivalentAmount: convertFromUlps("1.9490188708730952e+22").toString(),
  },
  {
    amount: "100000000000000000000",
    name: EBalanceViewType.NEUR,
    euroEquivalentAmount: convertFromUlps("1.9490188708730952e+22").toString(),
  },
  {
    amount: "100000000000000000000",
    name: EBalanceViewType.ICBM_NEUR,
    euroEquivalentAmount: convertFromUlps("1.9490188708730952e+22").toString(),
  },
  {
    amount: "100000000000000000000",
    name: EBalanceViewType.LOCKED_ICBM_NEUR,
    euroEquivalentAmount: convertFromUlps("1.9490188708730952e+22").toString(),
  },
];

const balanceActions = createBalanceActions(dummyDispatch);
const balances = balanceData.map(b => createBalanceUiData(b, balanceActions));

storiesOf("BalanceList", module).add("default", () => <BalanceList balances={balances} />);
