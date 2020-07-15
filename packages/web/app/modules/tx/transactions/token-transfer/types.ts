import { TypeOfYTS, YupTS } from "@neufund/shared-modules";
import { EquityToken } from "@neufund/shared-utils";

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

export const TokenTransferAdditionalDataSchema = YupTS.object({
  to: YupTS.string(),
  amount: YupTS.string(),
  amountEur: YupTS.string(),
  tokenImage: YupTS.string(),
  tokenSymbol: YupTS.string(),
  tokenDecimals: YupTS.number(),
});

export type TokenTransferAdditionalData = TypeOfYTS<typeof TokenTransferAdditionalDataSchema>;
