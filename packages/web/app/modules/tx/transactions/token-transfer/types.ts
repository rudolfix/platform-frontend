import { EquityToken } from "@neufund/shared";

export type TTokenTransferAdditionalData = {
  to: string;
  amount: string;
  amountEur: string;
  total: null;
  totalEur: null;
  tokenImage: string;
  tokenSymbol: EquityToken;
  tokenDecimals: number;
};
