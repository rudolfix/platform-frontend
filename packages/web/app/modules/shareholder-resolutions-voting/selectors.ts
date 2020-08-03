import { etoModuleApi, TModuleState } from "@neufund/shared-modules";
import { EthereumAddressWithChecksum } from "@neufund/shared-utils";

import { TAppGlobalState } from "../../store";
import { setupShareholderResolutionsVotingModule } from "./module";

export type TShareholderResolutionsVotingModuleState = TModuleState<
  typeof setupShareholderResolutionsVotingModule
>;

export const selectProposalById = (proposalId: string) => (
  state: TShareholderResolutionsVotingModuleState,
) => state.shareholderResolutionsVoting.proposals[proposalId];

export const selectShareholderVotes = (address: EthereumAddressWithChecksum) => (
  state: TShareholderResolutionsVotingModuleState,
) => state.shareholderResolutionsVoting.shareholdersVotes[address];

export const selectShareholderProposalVote = (
  address: EthereumAddressWithChecksum,
  proposalId: string,
) => (state: TShareholderResolutionsVotingModuleState) => {
  const shareholderVotes = selectShareholderVotes(address)(state);

  return shareholderVotes?.find(sV => sV.proposalId === proposalId);
};

/**
 * @note It's a tricky way given we are forced to traverse etos list locally.
 * @todo When backend provides an API use a proper mechanism to get proposal ETO
 */
export const selectProposalEto = (proposalId: string) => (state: TAppGlobalState) => {
  const etos = etoModuleApi.selectors.selectEtos(state);
  const proposal = selectProposalById(proposalId)(state);

  if (etos && proposal) {
    return etos.find(eto => eto.companyId === proposal.companyId);
  }

  return undefined;
};
