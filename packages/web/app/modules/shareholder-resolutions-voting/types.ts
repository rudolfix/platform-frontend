import { EthereumAddressWithChecksum } from "@neufund/shared-utils";

/**
 * Proposal states:
 * Campaigning: Initial state where voting owner can build quorum for public visibility
 * Public: Has passed campaign-quorum in time, voting publicly announced
 * Reveal: Reveal state where meta-transactions are gathered
 * Tally: For votings that have off-chain counterpart, this is the time to upload the tally
 * Final: Vote count will not change and tally is available, terminal state
 *
 * @note Enum values should match the one returned from contract
 */
export enum EProposalState {
  Campaigning = 0,
  Public = 1,
  Reveal = 2,
  Tally = 3,
  Final = 4,
}

export interface IProposalDetails {
  state: EProposalState;
  votingLegalRep: EthereumAddressWithChecksum;
  tokenAddress: EthereumAddressWithChecksum;
  title: string;
  ipfsHash: string;
  createdAt: number;
  startsAt: number;
  endsAt: number;
}

export interface IProposalTally {
  tokenVotingPower: string;
  inFavor: string;
  against: string;
}

type TProposalExtras = {
  tally: IProposalTally;
  id: string;
  votingContractAddress: EthereumAddressWithChecksum;
  quorum: string;
};

export type TProposal = IProposalDetails & TProposalExtras;

/**
 * @note Enum values should match the one returned from contract
 */
export enum EShareholderVoteResolution {
  Abstain = 0,
  InFavor = 1,
  Against = 2,
}

export interface IShareholderVote {
  address: EthereumAddressWithChecksum;
  proposalId: string;
  state: EShareholderVoteResolution;
  votingPower: string;
}
