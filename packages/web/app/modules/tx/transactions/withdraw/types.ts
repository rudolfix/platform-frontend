import { TypeOfYTS, YupTS } from "@neufund/shared-modules";
import { EquityToken } from "@neufund/shared-utils";

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

export type TWithdrawAdditionalData = TypeOfYTS<typeof WithdrawAdditionalDataSchema>;
