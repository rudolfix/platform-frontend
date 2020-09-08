import { call, select } from "@neufund/sagas/dist/sagaEffects";
import {
  coreModuleApi,
  etoModuleApi,
  ETxType,
  IEquityTokenAdapter,
  neuGetBindings,
  TEtoSpecsData,
} from "@neufund/shared-modules";
import { ETHEREUM_ZERO_ADDRESS } from "@neufund/shared-utils";
import cryptoRandomString from "crypto-random-string";
import { symbols } from "../../../../../di/symbols";
import { IControllerGovernance } from "../../../../../lib/contracts/IControllerGovernance";
import { ITxData } from "../../../../../lib/web3/types";
import { actions, TActionFromCreator } from "../../../../actions";
import { selectIssuerEto, selectIssuerEtoPreviewCode } from "../../../../eto-flow/selectors";
import { EGovernanceAction } from "../../../../governance/module";
import { selectGovernanceController } from "../../../../governance/sagas";
import { TVotingResolution } from "../../../../shareholder-resolutions-voting-setup/module";
import { selectEthereumAddress } from "../../../../web3/selectors";
import { ITxSendParams, txSendSaga } from "../../../sender/sagas";
import { selectStandardGasPriceWithOverHead } from "../../../sender/selectors";
import { txTransactionsActions } from "../../actions";

function* generateShareholderVotingResolutionSetupTransaction(votingResolution: TVotingResolution) {
  console.log({ votingResolution });
  const { web3Manager, contractsService } = yield* neuGetBindings({
    contractsService: symbols.contractsService,
    web3Manager: symbols.web3Manager,
  });

  const etoPreviewCode = yield* select(selectIssuerEtoPreviewCode);
  const contract = yield* select(state =>
    etoModuleApi.selectors.selectEtoContract(state, etoPreviewCode),
  );
  console.log({ contract });

  // TODO#4556 proposal id must be randomly generated
  // TODO#4556 the same proposal id must be passed when uploading document to ipfs
  const proposalId = cryptoRandomString({ length: 32 });
  const token = contract.equityTokenAddress;
  const campaignDuration = "0";
  const campaignQuorumFraction = "0";
  const votingPeriod = votingResolution.votingDuration * 24 * 60 * 60; // days to seconds

  const votingLegalRep = votingResolution.includeExternalVotes
    // TODO#4556 get votingLegalRep
    ? "0x6A57FeBaE70BfC83c64835eA58240958fba328ff" // wallet that has right to upload documents
    : ETHEREUM_ZERO_ADDRESS; // because no off-chain part;

  const offchainVotePeriod = votingResolution.includeExternalVotes
    ? votingResolution.submissionDeadline * 24 * 60 * 60
    : 0; // days to seconds

  const equityTokenAddress = contract.equityTokenAddress;
  const equityToken: IEquityTokenAdapter = yield contractsService.getEquityToken(
    equityTokenAddress,
  );
  const tokensPerShare = yield equityToken.tokensPerShare;
  const shareNominalValueUlps = yield equityToken.shareNominalValueUlps;
  // TODO#4556 verify formula, is there a util?
  const totalVotingPower = Math.floor(
    (votingResolution.votingShareCapital * tokensPerShare) / shareNominalValueUlps,
  ); // share capital expressed as tokens

  const action = votingResolution.includeExternalVotes
    ? EGovernanceAction.NONE
    : EGovernanceAction.THR_NONE;

  const actionPayload = [
    votingResolution.title,
    "ipfs:QmTMaASvPiyjht8ZCTkR6NnRSiYct6g2jjSoPF8ATWmygE",
  ];
  const enableObserver = false;

  const tx = yield* call(
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

  console.log({ tx: tx.getData() });

  const eto: TEtoSpecsData = yield select(selectIssuerEto);
  const governanceController: IControllerGovernance = yield* call(
    selectGovernanceController,
    eto.equityTokenContractAddress,
  );

  const userAddress = yield select(selectEthereumAddress);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);
  const toAddress = yield governanceController.address;

  const txInitialDetails = {
    to: toAddress,
    value: "0",
    data: tx.getData(),
    from: userAddress,
    gasPrice: gasPriceWithOverhead,
  };

  const gas: string = yield web3Manager.estimateGasWithOverhead(txInitialDetails);
  const txDetails: ITxData = {
    ...txInitialDetails,
    gas,
  };

  return txDetails;
}

function* shareholderResolutionVotingSetupTransactionFlow(_: unknown, votingResolution) {
  const generatedTxDetails: ITxData = yield* call(
    generateShareholderVotingResolutionSetupTransaction,
    votingResolution,
  );

  yield put(actions.txSender.setTransactionData(generatedTxDetails));

  yield put(
    actions.txSender.txSenderContinueToSummary<ETxType.SHAREHOLDER_RESOLUTIONS_VOTE>(undefined),
  );
}

export function* shareholderVotingResolutionSetup(
  action: TActionFromCreator<typeof txTransactionsActions.startShareholderVotingResolutionSetup>,
) {
  const { logger } = yield* neuGetBindings({
    logger: coreModuleApi.symbols.logger,
  });

  try {
    const params: ITxSendParams = {
      type: ETxType.SHAREHOLDER_RESOLUTIONS_VOTE_SETUP,
      transactionFlowGenerator: shareholderResolutionVotingSetupTransactionFlow,
      extraParam: action.payload,
    };

    yield txSendSaga(params);
    logger.info("Shareholder voting resolution setup successful");
  } catch (e) {
    logger.error(e, "Shareholder voting resolution setup failed");
  }
}
