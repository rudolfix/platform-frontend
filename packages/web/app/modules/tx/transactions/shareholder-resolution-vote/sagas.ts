import { call, put, SagaGenerator, select, takeLatest } from "@neufund/sagas";
import { coreModuleApi, ETxType, neuGetBindings } from "@neufund/shared-modules";
import { invariant } from "@neufund/shared-utils";

import { symbols } from "../../../../di/symbols";
import { ITxData } from "../../../../lib/web3/types";
import { actions, TActionFromCreator } from "../../../actions";
import { selectUserId } from "../../../auth/selectors";
import { shareholderResolutionsVotingViewModuleApi } from "../../../shareholder-resolutions-voting-view/module";
import { shareholderResolutionsVotingModuleApi } from "../../../shareholder-resolutions-voting/module";
import { makeEthereumAddressChecksummed } from "../../../web3/utils";
import { ITxSendParams, txSendSaga } from "../../sender/sagas";
import { selectStandardGasPriceWithOverHead } from "../../sender/selectors";
import { selectTxGasCostEthUlps, selectTxGasCostEurUlps } from "./../../sender/selectors";
import { shareholderVotingResolutionSetup } from "./setup/sagas";

function* generateShareholderResolutionVoteTransaction(
  proposalId: string,
  voteInFavor: boolean,
): SagaGenerator<ITxData> {
  const { web3Manager, contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
    web3Manager: symbols.web3Manager,
  });

  const shareholderAddress = yield* select(selectUserId);

  invariant(shareholderAddress, "No logged in user found");

  const gasPriceWithOverhead = yield* select(selectStandardGasPriceWithOverHead);

  // TODO: check whether typechain bug still is not fixed
  // sorry no typechain, typechain has a bug with boolean casting
  const txInput = contractsService.votingCenter.rawWeb3Contract.vote.getData(
    proposalId,
    voteInFavor,
  );

  const txInitialDetails = {
    to: makeEthereumAddressChecksummed(contractsService.votingCenter.address),
    from: shareholderAddress,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead = yield* call(
    [web3Manager, "estimateGasWithOverhead"],
    txInitialDetails,
  );

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };

  return txDetails;
}

function* shareholderResolutionVoteTransactionFlow(
  _: unknown,
  { proposalId, voteInFavor }: { proposalId: string; voteInFavor: boolean },
): SagaGenerator<void> {
  const generatedTxDetails: ITxData = yield* call(
    generateShareholderResolutionVoteTransaction,
    proposalId,
    voteInFavor,
  );

  yield put(actions.txSender.setTransactionData(generatedTxDetails));

  const gasCost = yield* select(selectTxGasCostEthUlps);
  const gasCostEur = yield* select(selectTxGasCostEurUlps);

  const proposal = yield* select(
    shareholderResolutionsVotingModuleApi.selectors.selectProposalById(proposalId),
  );
  const proposalEto = yield* select(
    shareholderResolutionsVotingModuleApi.selectors.selectProposalEto(proposalId),
  );

  invariant(proposal, "Proposal should exist");
  invariant(proposalEto, "Proposal ETO should exist");

  yield put(
    actions.txSender.txSenderContinueToSummary<ETxType.SHAREHOLDER_RESOLUTIONS_VOTE>({
      companyName: proposalEto.company.name,
      proposalTitle: proposal.title,
      voteInFavor,
      gasCost,
      gasCostEur,
    }),
  );
}

function* shareholderResolutionVote({
  payload,
}: TActionFromCreator<typeof actions.txTransactions.startShareholderResolutionVote>): SagaGenerator<
  void
> {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const params: ITxSendParams = {
      type: ETxType.SHAREHOLDER_RESOLUTIONS_VOTE,
      transactionFlowGenerator: shareholderResolutionVoteTransactionFlow,
      extraParam: { proposalId: payload.proposalId, voteInFavor: payload.voteInFavor },
    };

    yield txSendSaga(params);
    logger.info("Shareholder resolution vote successful");
  } catch (e) {
    logger.error(e, "Shareholder resolution vote failed");
  } finally {
    yield put(
      shareholderResolutionsVotingViewModuleApi.actions.refreshInvestorShareholderResolutionVotingView(
        payload.proposalId,
      ),
    );
  }
}

export function* txShareholderResolutionVoteSagas(): SagaGenerator<void> {
  yield takeLatest(
    actions.txTransactions.startShareholderResolutionVote,
    shareholderResolutionVote,
  );
  yield takeLatest(
    actions.txTransactions.startShareholderVotingResolutionSetup,
    shareholderVotingResolutionSetup,
  );
}
