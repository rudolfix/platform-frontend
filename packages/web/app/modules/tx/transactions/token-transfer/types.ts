import { EquityToken } from "@neufund/shared-utils";

import * as YupTS from "../../../../lib/yup-ts.unsafe";

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

export type TokenTransferAdditionalData = YupTS.TypeOf<typeof TokenTransferAdditionalDataSchema>;
