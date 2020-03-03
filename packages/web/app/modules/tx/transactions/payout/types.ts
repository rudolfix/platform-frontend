import * as YupTS from "../../../../lib/yup-ts.unsafe";

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

export type TInvestorAcceptPayoutAdditionalData = YupTS.TypeOf<
  typeof InvestorAcceptPayoutAdditionalDataSchema
>;
