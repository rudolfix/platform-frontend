import { nonNullable } from "@neufund/shared-utils";

import { TAppGlobalState } from "../../store";
import { selectUserId } from "../auth/selectors";
import { shareholderResolutionsVotingModuleApi } from "../shareholder-resolutions-voting/module";
import { TShareholderResolutionsVotingViewModuleState } from "./types";

export const selectProposalViewState = (state: TShareholderResolutionsVotingViewModuleState) => {
  const { processState, viewType, proposalId } = state.shareholderResolutionsVotingView;

  return { processState, viewType, proposalId };
};

export const selectProposal = (state: TShareholderResolutionsVotingViewModuleState) => {
  const { proposalId } = state.shareholderResolutionsVotingView;

  return proposalId
    ? shareholderResolutionsVotingModuleApi.selectors.selectProposalById(proposalId)(state)
    : undefined;
};

export const selectProposalShareholder = (state: TAppGlobalState) => {
  const { proposalId } = state.shareholderResolutionsVotingView;
  const shareholderAddress = nonNullable(selectUserId(state));

  return proposalId
    ? shareholderResolutionsVotingModuleApi.selectors.selectShareholderProposalVote(
        shareholderAddress,
        proposalId,
      )(state)
    : undefined;
};

export const selectProposalEto = (state: TAppGlobalState) => {
  const { proposalId } = state.shareholderResolutionsVotingView;

  return proposalId
    ? shareholderResolutionsVotingModuleApi.selectors.selectProposalEto(proposalId)(state)
    : undefined;
};
