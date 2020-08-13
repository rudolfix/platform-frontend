import {
  addBigNumbers,
  divideBigNumbers,
  invariant,
  isInEnum,
  subtractBigNumbers,
  toEquityTokenSymbol,
  toEthereumAddress,
  toPercentage,
  unixTimestampToTimestamp,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import Web3Utils from "web3-utils";

import { hashFromIpfsLink } from "../../components/documents/utils";
import { makeEthereumAddressChecksummed } from "../web3/utils";
import {
  ENomineeVote,
  EProposalState,
  EShareholderVoteResolution,
  IProposalDetails,
  IProposalTally,
  IShareCapitalBreakdown,
  IShareholderVote,
  ITokenHolderBreakdown,
  TProposal,
} from "./types";

export const convertToProposalDetails = ([
  state,
  token,
  _snapshotId,
  _initiator,
  _votingLegalRep,
  _campaignQuorumTokenAmount,
  _offchainVotingPower,
  _action,
  actionPayload,
  _enableObserver,
  deadlines,
]: [
  BigNumber,
  string,
  BigNumber,
  string,
  string,
  BigNumber,
  BigNumber,
  BigNumber,
  string[],
  boolean,
  BigNumber[],
]): IProposalDetails => {
  invariant(typeof actionPayload === "string", "Proposal actionPayload should be a string");

  // `actionPayload` is a hex string and contains title and ipfs hash separated by `,`
  const actionPayloadMatch = Web3Utils.hexToAscii(actionPayload).match(/(.+),(.+)/);

  invariant(actionPayloadMatch, "Proposal action payload is in invalid format");

  const title = actionPayloadMatch[1];
  const ipfsLink = actionPayloadMatch[2];

  invariant(title, "Proposal title should be defined");
  invariant(ipfsLink, "Proposal ipfs link should be defined");

  const stateAsNumber = state.toNumber();

  invariant(deadlines[0], "Proposal created date should be defined");
  invariant(deadlines[1], "Proposal start date should be defined");
  invariant(deadlines[2], "Proposal end date should be defined");
  invariant(isInEnum(EProposalState, stateAsNumber), "Invalid proposal state");

  return {
    title,
    state: stateAsNumber,
    ipfsHash: hashFromIpfsLink(ipfsLink),
    tokenAddress: makeEthereumAddressChecksummed(toEthereumAddress(token)),
    createdAt: unixTimestampToTimestamp(deadlines[0].toNumber()),
    startsAt: unixTimestampToTimestamp(deadlines[1].toNumber()),
    endsAt: unixTimestampToTimestamp(deadlines[2].toNumber()),
  };
};

export const convertToProposalTally = ([
  _state,
  inFavor,
  against,
  offchainInFavor,
  offchainAgainst,
  tokenVotingPower,
  totalVotingPower,
  _campaignQuorumTokenAmount,
  _initiator,
  _hasObserverInterface,
]: [
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  BigNumber,
  string,
  boolean,
]): IProposalTally => ({
  inFavor: inFavor.toString(),
  against: against.toString(),
  offchainInFavor: offchainInFavor.toString(),
  offchainAgainst: offchainAgainst.toString(),
  tokenVotingPower: tokenVotingPower.toString(),
  totalVotingPower: totalVotingPower.toString(),
});

// TODO: clean up the utilty method and remove redundant calculations
export const convertToShareholderVoteBreakdown = ({
  inFavor,
  against,
  tokenVotingPower,
  nomineeName,
  decimals,
  tokenSymbol,
}: {
  inFavor: string;
  against: string;
  tokenVotingPower: string;
  decimals: BigNumber;
  tokenSymbol: string;
  nomineeName: string;
}): ITokenHolderBreakdown => ({
  inFavorPercentage: new BigNumber(inFavor)
    .div(tokenVotingPower)
    .mul("100")
    .toString(),
  inFavor: inFavor,
  againstPercentage: new BigNumber(against)
    .div(tokenVotingPower)
    .mul("100")
    .toString(),
  against: against,
  abstainPercentage: new BigNumber(tokenVotingPower)
    .minus(inFavor)
    .minus(against)
    .div(tokenVotingPower)
    .mul("100")
    .toString(),
  abstain: new BigNumber(tokenVotingPower)
    .minus(inFavor)
    .minus(against)
    .toString(),
  nomineeVote:
    new BigNumber(against).comparedTo(new BigNumber(tokenVotingPower).div("2").floor()) === 1
      ? ENomineeVote.AGAINST
      : ENomineeVote.IN_FAVOUR,
  decimals: decimals.toNumber(),
  totalTokens: tokenVotingPower,
  tokenSymbol: toEquityTokenSymbol(tokenSymbol),
  nomineeName,
});

export const convertToShareCapitalBreakdown = ({
  nomineeVote,
  offChainInFavor,
  offchainAgainst,
  shareNominalValueUlps,
  tokensPerShare,
  tokenVotingPower,
  offChainVoteDocumentUri,
  totalVotingPower,
}: {
  nomineeVote: ENomineeVote;
  offChainInFavor: string;
  tokenVotingPower: string;
  offchainAgainst: string;
  totalVotingPower: string;
  shareNominalValueUlps: BigNumber;
  tokensPerShare: BigNumber;
  offChainVoteDocumentUri: string | null;
}): IShareCapitalBreakdown => ({
  resolutionPassed:
    new BigNumber(offChainInFavor)
      .add(nomineeVote === ENomineeVote.IN_FAVOUR ? tokenVotingPower : "0")
      .comparedTo(
        new BigNumber(offchainAgainst).add(
          nomineeVote === ENomineeVote.AGAINST ? tokenVotingPower : "0",
        ),
      ) === 1,
  shareCapitalInFavor: new BigNumber(offChainInFavor)
    .add(nomineeVote === ENomineeVote.IN_FAVOUR ? tokenVotingPower : "0")
    .mul(shareNominalValueUlps)
    .div(tokensPerShare)
    .floor()
    .toString(),
  shareCapitalAgainst: new BigNumber(offchainAgainst)
    .add(nomineeVote === ENomineeVote.AGAINST ? tokenVotingPower : "0")
    .mul(shareNominalValueUlps)
    .div(tokensPerShare)
    .floor()
    .toString(),
  shareCapitalAbstain: new BigNumber(totalVotingPower)
    .sub(offchainAgainst)
    .sub(offChainInFavor)
    .sub(tokenVotingPower)
    .mul(shareNominalValueUlps)
    .div(tokensPerShare)
    .floor()
    .toString(),
  offChainVoteDocumentUri:
    offChainVoteDocumentUri === null ? null : hashFromIpfsLink(offChainVoteDocumentUri),
});

export const convertToShareholderVoteResolution = (
  state: BigNumber,
): EShareholderVoteResolution => {
  const stateAsNumber = state.toNumber();

  invariant(isInEnum(EShareholderVoteResolution, stateAsNumber), "Invalid shareholder vote state");

  return stateAsNumber;
};

export const calculateParticipationPercentage = ({ tally }: Pick<TProposal, "tally">) =>
  toPercentage(
    divideBigNumbers(addBigNumbers([tally.inFavor, tally.against]), tally.tokenVotingPower),
  );

export const calculateInFavorParticipationPercentage = ({ tally }: Pick<TProposal, "tally">) =>
  toPercentage(divideBigNumbers(tally.inFavor, tally.tokenVotingPower));

export const calculateAgainstParticipationPercentage = ({ tally }: Pick<TProposal, "tally">) =>
  toPercentage(divideBigNumbers(tally.against, tally.tokenVotingPower));

export const calculateAbstainedParticipationPercentage = ({ tally }: Pick<TProposal, "tally">) =>
  subtractBigNumbers([
    "100",
    addBigNumbers([
      calculateInFavorParticipationPercentage({ tally }),
      calculateAgainstParticipationPercentage({ tally }),
    ]),
  ]);

export const calculateAbstainedParticipationTokens = ({ tally }: Pick<TProposal, "tally">) => {
  const currentParticipation = addBigNumbers([tally.inFavor, tally.against]);
  return subtractBigNumbers([tally.tokenVotingPower, currentParticipation]);
};

export const calculateShareholderParticipationPercentage = (
  { votingPower }: IShareholderVote,
  { tally }: Pick<TProposal, "tally">,
) => toPercentage(divideBigNumbers(votingPower, tally.tokenVotingPower));
