import { EquityToken } from "./../../../../utils/opaque-types/types";

export type TWithdrawAdditionalData = {
  to: string;
  amount: string;
  amountEur: string;
  total: string;
  totalEur: string;
  tokenImage: string;
  tokenSymbol: EquityToken;
  tokenDecimals: number;
};
