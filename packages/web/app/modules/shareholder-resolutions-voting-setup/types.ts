import * as Yup from "yup";

export const VotingResolutionSchema = Yup.object().shape({
  title: Yup.string().required(),
  votingDuration: Yup.number().required(),
  includeExternalVotes: Yup.boolean().required(),
  votingShareCapital: Yup.number().required(),
  submissionDeadline: Yup.number().required(),
});

export type TVotingResolutionSetupData = {
  title: string;
  votingDuration: string;
  includeExternalVotes: boolean;
  votingShareCapital: boolean;
  submissionDeadline?: boolean;
};
