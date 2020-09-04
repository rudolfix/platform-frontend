import { call } from "@neufund/sagas/dist/sagaEffects";
import { coreModuleApi, ETxType, neuGetBindings } from "@neufund/shared-modules";
import { symbols } from "../../../../../di/symbols";
import { ITxData } from "../../../../../lib/web3/types";
import { EGovernanceAction } from "../../../../governance/types";
import { ITxSendParams, txSendSaga } from "../../../sender/sagas";
import cryptoRandomString from "crypto-random-string";

function* generateShareholderVotingResolutionSetupTransaction() {
  const { web3Manager, contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
    web3Manager: symbols.web3Manager,
  });

  const proposalId = cryptoRandomString({ length: 32 });
  const token = "0x535BFaeB50580F674bD2e076D6073aDF28A46fA8";
  const campaignDuration = "0";
  const campaignQuorumFraction = "0";
  const votingPeriod = "864000";
  const votingLegalRep = "0x6A57FeBaE70BfC83c64835eA58240958fba328ff";
  const offchainVotePeriod = "5184000";
  const totalVotingPower = "289000000";
  const action = EGovernanceAction.NONE;
  const actionPayload = [
    "INVITATION TO THE ASSEMBLY MEETING GREYP BIKES d.o.o.",
    "ipfs:QmTMaASvPiyjht8ZCTkR6NnRSiYct6g2jjSoPF8ATWmygE",
  ];
  const enableObserver = false;

  const response = yield* call(
    [contractsService.votingCenter, "addProposalTx"],
    proposalId,
    token,
    campaignDuration,
    campaignQuorumFraction,
    votingPeriod,
    votingLegalRep,
    offchainVotePeriod,
    totalVotingPower,
    action,
    actionPayload,
    enableObserver,
  );

  // vc.addProposal(
  //   "0x812a9e472eb686a81c925a07b30598fe470cf90e736222be7326b4a80c7a5fbd",
  //   "0x535BFaeB50580F674bD2e076D6073aDF28A46fA8",
  //   "0",
  //   "0",
  //   "864000",
  //   "0x7daF380AdD84C05eaE2065E06C4922C37Ea2D932",
  //   "5184000",
  //   "289000000",
  //   "22",
  //   "INVITATION TO THE ASSEMBLY MEETING GREYP BIKES d.o.o.,ipfs:QmTMaASvPiyjht8ZCTkR6NnRSiYct6g2jjSoPF8ATWmygE",
  //   false, {gas: 800000})

  console.log({ response });
}

function* shareholderResolutionVotingSetupTransactionFlow() {
  const generatedTxDetails: ITxData = yield* call(
    generateShareholderVotingResolutionSetupTransaction,
  );
}

export function* shareholderVotingResolutionSetup() {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const params: ITxSendParams = {
      type: ETxType.EXECUTE_RESOLUTION,
      transactionFlowGenerator: shareholderResolutionVotingSetupTransactionFlow,
      // extraParam: { proposalId: payload.proposalId, voteInFavor: payload.voteInFavor },
    };

    yield txSendSaga(params);
    logger.info("Shareholder voting resolution setup successful");
  } catch (e) {
    logger.error(e, "Shareholder voting resolution setup failed");
  }
}
