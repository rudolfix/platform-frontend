import { txHistoryApi, TModuleState } from "@neufund/shared-modules";
import { ECurrency } from "@neufund/shared-utils";

import { setupWalletScreenModule } from "modules/wallet-screen/module";

import { TToken } from "utils/types";

export type TWalletScreenModuleState = TModuleState<typeof setupWalletScreenModule>;

export enum EBalanceViewType {
  ETH = "balanceTypeEth",
  NEUR = "balanceTypeNeur",
  ICBM_ETH = "balanceTypeIcbmEth",
  ICBM_NEUR = "balanceTypeIcbmNeur",
  LOCKED_ICBM_ETH = "balanceTypeLockedIcbmEth",
  LOCKED_ICBM_NEUR = "balanceTypeLockedIcbmNeur",
}

export type TBalance = {
  type: EBalanceViewType;
  amount: TToken<ECurrency.EUR_TOKEN | ECurrency.ETH>;
  euroEquivalentAmount: TToken<ECurrency.EUR>;
};

export type TxHistoryPaginated = ReturnType<typeof txHistoryApi.selectors.selectTxHistoryPaginated>;
