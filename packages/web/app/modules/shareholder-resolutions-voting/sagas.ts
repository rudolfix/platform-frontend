import { all, call, put, SagaGenerator, select, take } from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";
import {
  EthereumAddressWithChecksum,
  isZero,
  nonNullable,
  toEthereumAddress,
  toEthereumChecksumAddress,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

import { symbols } from "../../di/symbols";
import { actions as globalActions } from "../actions";
import { selectUserId } from "../auth/selectors";
import { makeEthereumAddressChecksummed } from "../web3/utils";
import { actions } from "./actions";
import {
  ProposalNotFoundError,
  ProposalStateNotSupportedError,
  ShareholderHasNoAccessToProposalError,
} from "./errors";
import { EProposalState, IShareholderVote, TProposal } from "./types";
import {
  convertToProposalDetails,
  convertToProposalTally,
  convertToShareCapitalBreakdown,
  convertToShareholderVoteBreakdown,
  convertToShareholderVoteResolution,
} from "./utils";

export function* ensureProposalExists(proposalId: string): SagaGenerator<void> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
  });

  const hasProposal = yield* call([contractsService.votingCenter, "hasProposal"], proposalId);

  if (!hasProposal) {
    throw new ProposalNotFoundError(proposalId);
  }
}

export function* ensureInvestorHasAccessToProposal(
  proposalId: string,
  shareholderAddress: EthereumAddressWithChecksum,
): SagaGenerator<{ votingPower: BigNumber }> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
  });

  yield* call(ensureProposalExists, proposalId);

  const votingPower = yield* call(
    [contractsService.votingCenter, "getVotingPower"],
    proposalId,
    shareholderAddress,
  );

  if (isZero(votingPower)) {
    throw new ShareholderHasNoAccessToProposalError();
  }

  return { votingPower };
}
export function* loadProposalEto(): SagaGenerator<void> {
  // TODO: Provide a proper implementation so we can only load the eto we really need to display
  yield put(globalActions.eto.loadEtos());
  yield* take(globalActions.eto.setEtos);
}

export function* loadInvestorShareholderResolution(proposalId: string): SagaGenerator<void> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
    logger: coreModuleApi.symbols.logger,
  });

  const shareholderAddress = nonNullable(yield* select(selectUserId), "No logged in user found");

  const { votingPower } = yield* call(
    ensureInvestorHasAccessToProposal,
    proposalId,
    shareholderAddress,
  );

  const proposalDetails = convertToProposalDetails(
    yield* call([contractsService.votingCenter, "timedProposal"], proposalId),
  );

  // TODO: Handle other shareholder proposal states
  if (
    proposalDetails.state !== EProposalState.Public &&
    proposalDetails.state !== EProposalState.Tally &&
    proposalDetails.state !== EProposalState.Final
  ) {
    throw new ProposalStateNotSupportedError(proposalDetails.state);
  }

  const { proposalTallyRaw, voteStateRaw, equityToken } = yield* all({
    proposalTallyRaw: call([contractsService.votingCenter, "tally"], proposalId),
    voteStateRaw: call([contractsService.votingCenter, "getVote"], proposalId, shareholderAddress),
    equityToken: call([contractsService, "getEquityToken"], proposalDetails.tokenAddress),
  });

  const proposalTally = convertToProposalTally(proposalTallyRaw);

  const offChainVoteDocumentUri = new BigNumber(proposalTally.offchainAgainst)
    .add(proposalTally.offchainInFavor)
    .isZero()
    ? null
    : yield* call([contractsService.votingCenter, "offchainVoteDocumentUri"], proposalId);

  const voteState = convertToShareholderVoteResolution(voteStateRaw);

  const companyId = makeEthereumAddressChecksummed(
    toEthereumAddress(yield* call(() => equityToken.companyLegalRepresentative)),
  );

  const { decimals, tokenSymbol, shareNominalValueUlps, tokensPerShare } = yield* all({
    decimals: call(() => equityToken.decimals),
    tokenSymbol: call(() => equityToken.symbol),
    shareNominalValueUlps: call(() => equityToken.shareNominalValueUlps),
    tokensPerShare: call(() => equityToken.tokensPerShare),
  });

  const tokenHolderNomineeBreakdown = convertToShareholderVoteBreakdown({
    inFavor: proposalTally.inFavor,
    against: proposalTally.against,
    tokenVotingPower: proposalTally.tokenVotingPower,
    decimals,
    // @see https://github.com/Neufund/platform-frontend/issues/4422#issuecomment-670388797
    nomineeName: "Nominee",
    tokenSymbol,
  });

  const proposal: TProposal = {
    ...proposalDetails,
    companyId,
    id: proposalId,
    state: proposalDetails.state,
    votingContractAddress: toEthereumChecksumAddress(contractsService.votingCenter.address),
    tally: proposalTally,
    // hardcoded for now (we could take it from smart contract but it will be too complicated)
    quorum: "50",
  };

  const shareholderVote: IShareholderVote = {
    proposalId,
    address: shareholderAddress,
    state: voteState,
    votingPower: votingPower.toString(),
  };

  yield* call(loadProposalEto);

  yield put(actions.setShareholderResolutionVotingProposal(proposal));
  yield put(
    actions.setShareholderResolutionVotingProposalShareholderVote(proposal.id, shareholderVote),
  );
  if (proposalDetails.state >= EProposalState.Tally) {
    yield put(actions.setNomineeShareholderVoteBreakdown(proposal.id, tokenHolderNomineeBreakdown));
  }
  if (proposalDetails.state === EProposalState.Final) {
    const shareCapital = convertToShareCapitalBreakdown({
      offChainInFavor: proposalTally.offchainInFavor,
      offchainAgainst: proposalTally.offchainAgainst,
      shareNominalValueUlps,
      offChainVoteDocumentUri,
      tokensPerShare,
      tokenVotingPower: proposalTally.tokenVotingPower,
      totalVotingPower: proposalTally.totalVotingPower,
      nomineeVote: tokenHolderNomineeBreakdown.nomineeVote,
    });
    yield put(actions.setShareCapitalBreakdown(proposal.id, shareCapital));
  }
}

export function* loadIssuerShareholderResolution(proposalId: string): SagaGenerator<void> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
    logger: coreModuleApi.symbols.logger,
  });

  yield* call(ensureProposalExists, proposalId);

  const issuerAddress = nonNullable(yield* select(selectUserId), "No logged in user found");

  const proposalDetails = convertToProposalDetails(
    yield* call([contractsService.votingCenter, "timedProposal"], proposalId),
  );

  // TODO: Handle other shareholder proposal states
  if (
    proposalDetails.state !== EProposalState.Public &&
    proposalDetails.state !== EProposalState.Tally &&
    proposalDetails.state !== EProposalState.Final
  ) {
    throw new ProposalStateNotSupportedError(proposalDetails.state);
  }

  const { proposalTallyRaw, equityToken } = yield* all({
    proposalTallyRaw: call([contractsService.votingCenter, "tally"], proposalId),
    equityToken: call([contractsService, "getEquityToken"], proposalDetails.tokenAddress),
  });

  const proposalTally = convertToProposalTally(proposalTallyRaw);

  const offChainVoteDocumentUri = new BigNumber(proposalTally.offchainAgainst)
    .add(proposalTally.offchainInFavor)
    .isZero()
    ? null
    : yield* call([contractsService.votingCenter, "offchainVoteDocumentUri"], proposalId);

  const companyId = makeEthereumAddressChecksummed(
    toEthereumAddress(yield* call(() => equityToken.companyLegalRepresentative)),
  );

  if (companyId !== issuerAddress) {
    throw new ProposalNotFoundError(proposalId);
  }

  const { decimals, tokenSymbol, shareNominalValueUlps, tokensPerShare } = yield* all({
    decimals: call(() => equityToken.decimals),
    tokenSymbol: call(() => equityToken.symbol),
    shareNominalValueUlps: call(() => equityToken.shareNominalValueUlps),
    tokensPerShare: call(() => equityToken.tokensPerShare),
  });

  const tokenHolderNomineeBreakdown = convertToShareholderVoteBreakdown({
    inFavor: proposalTally.inFavor,
    against: proposalTally.against,
    tokenVotingPower: proposalTally.tokenVotingPower,
    decimals,
    // @see https://github.com/Neufund/platform-frontend/issues/4422#issuecomment-670388797
    nomineeName: "Nominee",
    tokenSymbol,
  });

  const proposal: TProposal = {
    ...proposalDetails,
    companyId,
    id: proposalId,
    state: proposalDetails.state,
    votingContractAddress: toEthereumChecksumAddress(contractsService.votingCenter.address),
    tally: proposalTally,
    // hardcoded for now (we could take it from smart contract but it will be too complicated)
    quorum: "50",
  };

  yield* call(loadProposalEto);

  yield put(actions.setShareholderResolutionVotingProposal(proposal));
  if (proposalDetails.state >= EProposalState.Tally) {
    yield put(actions.setNomineeShareholderVoteBreakdown(proposal.id, tokenHolderNomineeBreakdown));
  }
  if (proposalDetails.state === EProposalState.Final) {
    const shareCapital = convertToShareCapitalBreakdown({
      offChainInFavor: proposalTally.offchainInFavor,
      offchainAgainst: proposalTally.offchainAgainst,
      shareNominalValueUlps,
      offChainVoteDocumentUri,
      tokensPerShare,
      tokenVotingPower: proposalTally.tokenVotingPower,
      totalVotingPower: proposalTally.totalVotingPower,
      nomineeVote: tokenHolderNomineeBreakdown.nomineeVote,
    });
    yield put(actions.setShareCapitalBreakdown(proposal.id, shareCapital));
  }
}
