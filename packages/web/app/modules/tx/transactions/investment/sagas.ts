import { BigNumber } from "bignumber.js";
import { all, fork, put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ITxData } from "../../../../lib/web3/types";
import { compareBigNumbers } from "../../../../utils/BigNumberUtils";
import { actions, TActionFromCreator } from "../../../actions";
import { selectStandardGasPriceWithOverHead } from "../../../gas/selectors";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { selectEtherTokenBalance } from "../../../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../../../web3/selectors";
import { txSendSaga } from "../../sender/sagas";
import { ETxSenderType } from "../../types";
import { EInvestmentType, EInvestmentValueType } from "../../user-flow/investment/reducer";
import { cleanupInvestmentView } from "../../user-flow/investment/sagas";

export const INVESTMENT_GAS_AMOUNT = "600000";

function* getEtherTokenTransaction(
  { contractsService }: TGlobalDependencies,
  etoId: string,
  investAmountUlps: BigNumber,
): Generator<any, any, any> {
  const etherTokenBalance = yield select(selectEtherTokenBalance);
  if (!etherTokenBalance) {
    throw new Error("No ether Token Balance");
  }
  if (compareBigNumbers(etherTokenBalance, investAmountUlps) >= 0) {
    // transaction can be fully covered by etherTokens

    // Call IERC223 compliant transfer function
    // otherwise ETOCommitment is not aware of any investment
    // TODO: Fix when TypeChain support overloads
    const data = contractsService.etherToken.rawWeb3Contract.transfer[
      "address,uint256,bytes"
    ].getData(etoId, investAmountUlps, "");
    return { data, to: contractsService.etherToken.address };
  } else {
    // fill up etherToken with ether from wallet
    const ethVal = new BigNumber(investAmountUlps);
    const value = ethVal.sub(etherTokenBalance);
    const txCall = contractsService.etherToken.rawWeb3Contract.depositAndTransfer[
      "address,uint256,bytes"
    ].getData(etoId, ethVal, "");

    return {
      value: value.toFixed(0, BigNumber.ROUND_DOWN),
      data: txCall,
      to: contractsService.etherToken.address,
    };
  }
}

export function* generateInvestmentTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  {
    investmentValueType,
    investmentType,
    etoId,
    investAmountUlps,
  }: {
    investmentValueType: EInvestmentValueType;
    investmentType: EInvestmentType;
    etoId: string;
    investAmountUlps: BigNumber;
  },
): Generator<any, any, any> {
  const from: string = yield select(selectEthereumAddressWithChecksum);
  const gasPrice: string = yield select(selectStandardGasPriceWithOverHead);
  let data;
  let to;
  let value;

  switch (investmentType) {
    case EInvestmentType.Eth:
      ({ value, data } = yield neuCall(getEtherTokenTransaction, etoId, investAmountUlps));
      to = contractsService.etherToken.address;
      break;
    case EInvestmentType.NEur:
      // @see https://github.com/ethereum-ts/TypeChain/issues/123
      // current version of typescript miss-type bytes as array of bytes.
      data = yield contractsService.euroToken.rawWeb3Contract.transfer[
        "address,uint256,bytes"
      ].getData(etoId, investAmountUlps, "");
      to = contractsService.euroToken.address;
      break;
    case EInvestmentType.ICBMEth:
      // @see https://github.com/ethereum-ts/TypeChain/issues/123
      // current version of typescript miss-type bytes as array of bytes.
      data = yield contractsService.etherLock.rawWeb3Contract.transfer[
        "address,uint256,bytes"
      ].getData(etoId, investAmountUlps, "");
      to = contractsService.etherLock.address;
      break;
    case EInvestmentType.ICBMnEuro:
      // @see https://github.com/ethereum-ts/TypeChain/issues/123
      // current version of typescript miss-type bytes as array of bytes.
      data = yield contractsService.euroLock.rawWeb3Contract.transfer[
        "address,uint256,bytes"
      ].getData(etoId, investAmountUlps, "");
      to = contractsService.euroLock.address;
      break;
  }
  const partialTransaction: Partial<ITxData> = {
    to,
    from,
    data,
    value: value || "0",
    gasPrice,
  };
  const gas =
    investmentValueType === EInvestmentValueType.PARTIAL_BALANCE
      ? yield web3Manager.estimateGasWithOverhead(partialTransaction)
      : yield INVESTMENT_GAS_AMOUNT;

  return { ...partialTransaction, gas };
}

function* investmentFlowGenerator(_: TGlobalDependencies): Generator<any, any, any> {
  const { payload } = yield take(actions.txUserFlowInvestment.submitTransaction);
  yield all([
    put(actions.txSender.setTransactionData(payload.transactionData)),
    put(actions.txSender.txSenderContinueToSummary(payload.additionalData)),
  ]);
}

function* investSaga(
  { logger }: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txTransactions.startInvestment>,
): Generator<any, any, any> {
  try {
    yield txSendSaga({
      type: ETxSenderType.INVEST,
      transactionFlowGenerator: investmentFlowGenerator,
    });
    logger.info("Investment successful");
  } catch (e) {
    // Add clean up functions here ...
    yield cleanupInvestmentView();
    logger.info("Investment cancelled", e);
  } finally {
    yield put(actions.eto.loadEto(payload.etoId));
  }
}

export const txInvestmentSagas = function*(): Generator<any, any, any> {
  yield fork(neuTakeLatest, actions.txTransactions.startInvestment, investSaga);
};
