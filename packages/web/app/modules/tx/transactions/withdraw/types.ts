import { EquityToken } from "@neufund/shared-utils";

import * as YupTS from "../../../../lib/yup-ts.unsafe";

export const WithdrawAdditionalDataSchema = YupTS.object({
  to: YupTS.string(),
  amount: YupTS.string(),
  total: YupTS.string(),
  totalEur: YupTS.string(),
  amountEur: YupTS.string(),
  tokenImage: YupTS.string(),
  tokenSymbol: YupTS.string<EquityToken>(),
  tokenDecimals: YupTS.number(),
});

export type TWithdrawAdditionalData = YupTS.TypeOf<typeof WithdrawAdditionalDataSchema>;
