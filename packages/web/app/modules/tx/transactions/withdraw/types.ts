import { EquityToken } from "@neufund/shared";

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
