import {
  addBigNumbers,
  divideBigNumbers,
  invariant,
  isInEnum,
  multiplyBigNumbers,
  toEthereumAddress,
  unixTimestampToTimestamp,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import * as Web3Utils from "web3-utils";

import { hashFromIpfsLink } from "../../components/documents/utils";
import { makeEthereumAddressChecksummed } from "../web3/utils";
import {
  EProposalState,
  EShareholderVoteResolution,
  IProposalDetails,
  IProposalTally,
  IShareholderVote,
  TProposal,
} from "./types";

export const convertToProposalDetails = ([
  state,
  token,
  _snapshotId,
  _initiator,
  votingLegalRep,
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
    votingLegalRep: makeEthereumAddressChecksummed(toEthereumAddress(votingLegalRep)),
    createdAt: unixTimestampToTimestamp(deadlines[0].toNumber()),
    startsAt: unixTimestampToTimestamp(deadlines[1].toNumber()),
    endsAt: unixTimestampToTimestamp(deadlines[2].toNumber()),
  };
};

export const convertToProposalTally = ([
  _state,
  inFavor,
  against,
  _offchainInFavor,
  _offchainAgainst,
  tokenVotingPower,
  _totalVotingPower,
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
  tokenVotingPower: tokenVotingPower.toString(),
});

export const convertToShareholderVoteResolution = (
  state: BigNumber,
): EShareholderVoteResolution => {
  const stateAsNumber = state.toNumber();

  invariant(isInEnum(EShareholderVoteResolution, stateAsNumber), "Invalid shareholder vote state");

  return stateAsNumber;
};

export const calculateParticipation = ({ tally }: Pick<TProposal, "tally">) =>
  multiplyBigNumbers([
    divideBigNumbers(addBigNumbers([tally.inFavor, tally.against]), tally.tokenVotingPower),
    "100",
  ]);

export const calculateShareholderParticipation = (
  { votingPower }: IShareholderVote,
  { tally }: Pick<TProposal, "tally">,
) => multiplyBigNumbers([divideBigNumbers(votingPower, tally.tokenVotingPower), "100"]);
