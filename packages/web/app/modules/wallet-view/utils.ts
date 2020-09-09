import { EBalanceViewType, TBasicBalanceData } from "./types";

export const isMainBalance = (balance: TBasicBalanceData) =>
  balance.id === EBalanceViewType.ETH ||
  balance.id === EBalanceViewType.NEUR ||
  balance.id === EBalanceViewType.RESTRICTED_NEUR;

export const hasFunds = (balance: TBasicBalanceData) => balance.hasFunds;
