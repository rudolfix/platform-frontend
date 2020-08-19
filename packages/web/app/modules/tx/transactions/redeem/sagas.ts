import { fork, put, select, take } from "@neufund/sagas";
import { kycApi, TBankAccount, walletApi } from "@neufund/shared-modules";
import {
  compareBigNumbers,
  convertToUlps,
  DeepReadonly,
  EthereumAddressWithChecksum,
  ETH_DECIMALS,
  EURO_DECIMALS,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";

import { TGlobalDependencies } from "../../../../di/setupBindings";
import { ETxType, ITxData } from "../../../../lib/web3/types";
import { actions } from "../../../actions";
import { EBankTransferType } from "../../../bank-transfer-flow/reducer";
import {
  selectIsBankAccountVerified,
  selectRedeemFee,
} from "../../../bank-transfer-flow/selectors";
import { neuCall, neuTakeLatest } from "../../../sagasUtils";
import { selectEthereumAddress } from "../../../web3/selectors";
import { makeEthereumAddressChecksummed } from "../../../web3/utils";
import { txSendSaga } from "../../sender/sagas";
import { selectStandardGasPriceWithOverHead } from "../../sender/selectors";

function* generateNeuWithdrawTransaction(
  { contractsService, web3Manager }: TGlobalDependencies,
  amount: string,
): any {
  const from: EthereumAddressWithChecksum = yield select(selectEthereumAddress);
  const gasPriceWithOverhead = yield select(selectStandardGasPriceWithOverHead);

  const txInput = contractsService.euroToken.withdrawTx(new BigNumber(amount)).getData();

  const txDetails: Partial<ITxData> = {
    to: makeEthereumAddressChecksummed(contractsService.euroToken.address),
    from,
    data: txInput,
    value: "0",
    gasPrice: gasPriceWithOverhead,
  };
  const estimatedGasWithOverhead = yield web3Manager.estimateGasWithOverhead(txDetails);
  return { ...txDetails, gas: estimatedGasWithOverhead };
}

function* startNEuroRedeemGenerator(_: TGlobalDependencies): any {
  // Wait for withdraw confirmation
  const action = yield take(actions.txSender.txSenderAcceptDraft);
  const txDataFromUser = action.payload.txDraftData;
  const selectedAmount = txDataFromUser.value;

  const nEURBalanceUlps = yield select(walletApi.selectors.selectLiquidEuroTokenBalance);

  const nEURBalance = new BigNumber(nEURBalanceUlps)
    .div(new BigNumber("10").pow(ETH_DECIMALS))
    .toFixed(2, BigNumber.ROUND_DOWN);

  // Whole precision number should be passed when there is whole balance redeemed
  // also when user provided value has been used, then it have to be converted to Q18 via
  const redeemAmountUlps =
    compareBigNumbers(selectedAmount, nEURBalance) === 0
      ? nEURBalanceUlps
      : convertToUlps(selectedAmount);

  const generatedTxDetails: ITxData = yield neuCall(
    generateNeuWithdrawTransaction,
    redeemAmountUlps,
  );

  yield put(actions.txSender.setTransactionData(generatedTxDetails));

  const bankAccount: DeepReadonly<TBankAccount> = yield select(kycApi.selectors.selectBankAccount);
  if (!bankAccount.hasBankAccount) {
    throw new Error("During redeem process user should have bank account");
  }

  const bankFee: string = yield select(selectRedeemFee);
  const tokenDecimals = EURO_DECIMALS;

  const additionalDetails = {
    bankFee,
    amount: txDataFromUser.value,
    tokenDecimals,
    bankAccount: {
      bankName: bankAccount.details.bankName,
      accountNumberLast4: bankAccount.details.bankAccountNumberLast4,
    },
  };

  yield put(actions.txSender.txSenderContinueToSummary<ETxType.NEUR_REDEEM>(additionalDetails));
}

function* neurRedeemSaga({ logger }: TGlobalDependencies): Generator<any, any, any> {
  const isVerified: boolean = yield select(selectIsBankAccountVerified);

  if (!isVerified) {
    yield put(actions.bankTransferFlow.startBankTransfer(EBankTransferType.VERIFY));
    return;
  }

  try {
    yield txSendSaga({
      type: ETxType.NEUR_REDEEM,
      transactionFlowGenerator: startNEuroRedeemGenerator,
    });

    logger.info("Investor nEUR withdrawal successful");
  } catch (e) {
    logger.info("Investor nEUR withdrawal cancelled", e);
  }
}

export const txRedeemSagas = function*(): Generator<any, any, any> {
  yield fork(neuTakeLatest, actions.txTransactions.startWithdrawNEuro, neurRedeemSaga);
};
