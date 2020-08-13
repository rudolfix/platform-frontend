import { TypeOfYTS, YupTS } from "@neufund/shared-modules";

export const ShareholderResolutionVoteAdditionalDataSchema = YupTS.object({
  voteInFavor: YupTS.boolean(),
  companyName: YupTS.string(),
  proposalTitle: YupTS.string(),
  gasCost: YupTS.string(),
  gasCostEur: YupTS.string(),
});

export type TShareholderResolutionVoteAdditionalData = TypeOfYTS<
  typeof ShareholderResolutionVoteAdditionalDataSchema
>;
