import { TypeOfYTS, YupTS } from "@neufund/shared-modules";

export const ITokenDisbursalSchema = YupTS.object({
  token: YupTS.string(),
  amountToBeClaimed: YupTS.string(),
  totalDisbursedAmount: YupTS.string(),
  timeToFirstDisbursalRecycle: YupTS.number(),
  tokenDecimals: YupTS.number(),
});

export const InvestorAcceptPayoutAdditionalDataSchema = YupTS.object({
  tokensDisbursals: YupTS.array(ITokenDisbursalSchema),
});

export type TInvestorAcceptPayoutAdditionalData = TypeOfYTS<
  typeof InvestorAcceptPayoutAdditionalDataSchema
>;
