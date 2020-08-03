import { fork, put, select } from "@neufund/sagas";
import { etoModuleApi, IInvestorTicket, investorPortfolioModuleApi } from "@neufund/shared-modules";
import {
  convertFromUlps,
  ETH_DECIMALS,
  EthereumAddressWithChecksum,
  multiplyBigNumbers,
} from "@neufund/shared-utils";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ETOCommitment } from "../../../../lib/contracts/ETOCommitment";
import { ETxType, ITxData } from "../../../../lib/web3/types";
import { TAppGlobalState } from "../../../../store";
import { actions, TActionFromCreator } from "../../../actions";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { selectEtherPriceEur } from "../../../shared/tokenPrice/selectors";
import { selectEthereumAddress } from "../../../web3/selectors";
import { txSendSaga } from "../../sender/sagas";
import { selectStandardGasPriceWithOverHead, selectTxGasCostEthUlps } from "../../sender/selectors";

function* generateGetRefundTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  etoId: string,
): Generator<any, any, any> {
  const userAddress: EthereumAddressWithChecksum = yield select(selectEthereumAddress);
  const gasPriceWithOverhead: string = yield select(selectStandardGasPriceWithOverHead);

  const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(etoId);
  const txInput = etoContract.refundTx().getData();

  const txInitialDetails = {
    to: etoContract.address,
    from: userAddress,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };

  const estimatedGasWithOverhead: string = yield web3Manager.estimateGasWithOverhead(
    txInitialDetails,
  );

  const txDetails: ITxData = {
    ...txInitialDetails,
    gas: estimatedGasWithOverhead,
  };

  return txDetails;
}

function* startRefundGenerator(_: TGlobalDependencies, etoId: string): Generator<any, any, any> {
  const generatedTxDetails: ITxData = yield neuCall(generateGetRefundTransaction, etoId);
  yield put(actions.txSender.setTransactionData(generatedTxDetails));

  const etoData = yield select((state: TAppGlobalState) =>
    etoModuleApi.selectors.selectEtoWithCompanyAndContractById(state, etoId),
  );
  const investorTicket: IInvestorTicket = yield select((state: TAppGlobalState) =>
    investorPortfolioModuleApi.selectors.selectInvestorTicket(state, etoId),
  );
  const ethPrice: string = yield select(selectEtherPriceEur);
  const costUlps: string = yield select(selectTxGasCostEthUlps);
  const costEur = multiplyBigNumbers([ethPrice, convertFromUlps(costUlps).toString()]);
  const tokenDecimals = ETH_DECIMALS;

  yield put(
    actions.txSender.txSenderContinueToSummary<ETxType.INVESTOR_REFUND>({
      etoId,
      costUlps,
      costEur,
      tokenDecimals,
      tokenName: etoData.equityTokenName,
      tokenSymbol: etoData.equityTokenSymbol,
      amountEth: investorTicket.amountEth.toString(),
      amountEurUlps: investorTicket.amountEurUlps.toString(),
      companyName: etoData.company.brandName,
    }),
  );
}

function* etoRefundSaga(
  { logger }: TGlobalDependencies,
  action: TActionFromCreator<typeof actions.txTransactions.startInvestorRefund>,
): Generator<any, any, any> {
  const etoId = action.payload.etoId;
  try {
    yield txSendSaga({
      type: ETxType.INVESTOR_REFUND,
      transactionFlowGenerator: startRefundGenerator,
      extraParam: etoId,
    });
    logger.info("User refund successful");
  } catch (e) {
    logger.info("User refund cancelled", e);
  } finally {
    yield put(actions.eto.loadEto(etoId));
  }
}

export const txRefundSagas = function*(): Generator<any, any, any> {
  yield fork(neuTakeLatest, actions.txTransactions.startInvestorRefund, etoRefundSaga);
};
