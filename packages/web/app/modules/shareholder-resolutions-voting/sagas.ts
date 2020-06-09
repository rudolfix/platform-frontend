import {
  all,
  call,
  put,
  SagaGenerator,
  select,
  TActionFromCreator,
  takeLatest,
} from "@neufund/sagas";
import { coreModuleApi, neuGetBindings } from "@neufund/shared-modules";
import {
  EthereumAddressWithChecksum,
  isZero,
  nonNullable,
  toEthereumChecksumAddress,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

import { EVotingErrorMessage } from "../../components/translatedMessages/messages";
import { createNotificationMessage } from "../../components/translatedMessages/utils";
import { symbols } from "../../di/symbols";
import { actions as globalActions } from "../actions";
import { selectUserId } from "../auth/selectors";
import { webNotificationUIModuleApi } from "../notification-ui/module";
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
  convertToShareholderVoteResolution,
} from "./utils";

export function* ensureHasAccessToProposal(
  proposalId: string,
  shareholderAddress: EthereumAddressWithChecksum,
): SagaGenerator<{ votingPower: BigNumber }> {
  const { contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
  });

  const hasProposal = yield* call([contractsService.votingCenter, "hasProposal"], proposalId);

  if (!hasProposal) {
    throw new ProposalNotFoundError(proposalId);
  }

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

export function* loadShareholderResolution(
  action: TActionFromCreator<typeof actions, typeof actions.loadShareholderResolutionVoting>,
): SagaGenerator<void> {
  const { contractsService, logger } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
    logger: coreModuleApi.symbols.logger,
  });

  const proposalId = action.payload.proposalId;

  try {
    const shareholderAddress = nonNullable(yield* select(selectUserId), "No logged in user found");

    const { votingPower } = yield* call(ensureHasAccessToProposal, proposalId, shareholderAddress);

    const proposalDetails = convertToProposalDetails(
      yield* call([contractsService.votingCenter, "timedProposal"], proposalId),
    );

    // TODO: Handle other shareholder proposal states
    if (proposalDetails.state !== EProposalState.Public) {
      throw new ProposalStateNotSupportedError(proposalDetails.state);
    }

    const { proposalTallyRaw, voteStateRaw } = yield* all({
      proposalTallyRaw: call([contractsService.votingCenter, "tally"], proposalId),
      voteStateRaw: call(
        [contractsService.votingCenter, "getVote"],
        proposalId,
        shareholderAddress,
      ),
    });

    const proposalTally = convertToProposalTally(proposalTallyRaw);

    const voteState = convertToShareholderVoteResolution(voteStateRaw);

    const proposal: TProposal = {
      ...proposalDetails,
      id: proposalId,
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

    // TODO: Provide a proper implementation so we can only load the eto we really need to display
    yield put(globalActions.eto.loadEtos());

    yield put(actions.setShareholderResolutionVoting(proposal, shareholderVote));
  } catch (e) {
    switch (e.constructor) {
      case ProposalNotFoundError:
        yield put(globalActions.routing.goToDashboard());
        yield put(
          webNotificationUIModuleApi.actions.showError(
            createNotificationMessage(EVotingErrorMessage.UNKNOWN_PROPOSAL),
          ),
        );
        return;
      case ShareholderHasNoAccessToProposalError:
        yield put(globalActions.routing.goToDashboard());
        yield put(
          webNotificationUIModuleApi.actions.showError(
            createNotificationMessage(EVotingErrorMessage.CANNOT_VOTE),
          ),
        );
        return;
      case ProposalStateNotSupportedError:
        yield put(globalActions.routing.goToDashboard());
        yield put(
          webNotificationUIModuleApi.actions.showError(
            createNotificationMessage(EVotingErrorMessage.UNSUPPORTED_PROPOSAL_STATE),
          ),
        );
        return;

      default:
        logger.error(`Failed generate shareholder resolutions voting for ${proposalId}`, e);

        yield put(globalActions.routing.goToDashboard());

        yield put(
          webNotificationUIModuleApi.actions.showError(
            createNotificationMessage(EVotingErrorMessage.FAILED_TO_LOAD_PROPOSAL),
          ),
        );

        return;
    }
  }
}

export function* shareholderResolutionsVotingSagas(): SagaGenerator<void> {
  yield takeLatest(actions.loadShareholderResolutionVoting, loadShareholderResolution);
}
