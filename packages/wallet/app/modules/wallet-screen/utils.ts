import { isLessThanOrEqualToZero } from "@neufund/shared-utils";

import { EBalanceViewType, TBalance } from "modules/wallet-screen/types";

export const isMainBalance = (balance: TBalance) =>
  balance.type === EBalanceViewType.ETH || balance.type === EBalanceViewType.NEUR;

export const hasFunds = (balance: TBalance) => !isLessThanOrEqualToZero(balance.amount.value);
