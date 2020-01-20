import { EquityToken } from "./../../../../utils/opaque-types/types";

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
