import * as YupTS from "../../../../lib/yup-ts.unsafe";

export const ShareholderResolutionVoteAdditionalDataSchema = YupTS.object({
  voteInFavor: YupTS.boolean(),
  companyName: YupTS.string(),
  proposalTitle: YupTS.string(),
});

export type TShareholderResolutionVoteAdditionalData = YupTS.TypeOf<
  typeof ShareholderResolutionVoteAdditionalDataSchema
>;
