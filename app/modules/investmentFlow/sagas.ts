import BigNumber from "bignumber.js";
import { delay } from "redux-saga";
import { fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { ITxData } from "../../lib/web3/Web3Manager";
import { IAppState } from "../../store";
import { addBigNumbers, compareBigNumbers, divideBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Money.utils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TAction } from "../actions";
import { IGasState } from "../gas/reducer";
import { loadComputedContributionFromContract } from "../public-etos/sagas";
import { selectCalculatedContributionByEtoId, selectEtoById } from "../public-etos/selectors";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectEtherPriceEur } from "../shared/tokenPrice/selectors";
import { selectLiquidEtherBalance } from "../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import {
  EBankTransferFlowState,
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
  IInvestmentFlowState,
} from "./reducer";
import {
  selectCurrencyByInvestmentType,
  selectInvestmentGasCostEth,
  selectIsBankTransferModalOpened,
  selectIsICBMInvestment,
  selectReadyToInvest,
} from "./selectors";

function* processCurrencyValue(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE") return;

  const value = extractNumber(action.payload.value);

  yield put(actions.investmentFlow.setIsInputValidated(false));
  yield computeAndSetCurrencies(value && convertToBigInt(value), action.payload.currency);
  yield put(actions.investmentFlow.validateInputs());
}

function* computeAndSetCurrencies(value: string, currency: EInvestmentCurrency): any {
  const state: IAppState = yield select();
  const etherPriceEur = selectEtherPriceEur(state.tokenPrice);
  if (!value) {
    yield put(actions.investmentFlow.setEthValue(""));
    yield put(actions.investmentFlow.setEurValue(""));
  } else if (etherPriceEur && etherPriceEur !== "0") {
    const bignumber = new BigNumber(value);
    switch (currency) {
      case EInvestmentCurrency.Ether:
        const eurVal = bignumber.mul(etherPriceEur);
        yield put(
          actions.investmentFlow.setEthValue(bignumber.round(BigNumber.ROUND_UP).toString()),
        );
        yield put(actions.investmentFlow.setEurValue(eurVal.round(BigNumber.ROUND_UP).toString()));
        return;
      case EInvestmentCurrency.Euro:
        const ethVal = bignumber.div(etherPriceEur);
        yield put(actions.investmentFlow.setEthValue(ethVal.round(BigNumber.ROUND_UP).toString()));
        yield put(
          actions.investmentFlow.setEurValue(bignumber.round(BigNumber.ROUND_UP).toString()),
        );
        return;
    }
  }
}

function validateInvestment(state: IAppState): EInvestmentErrorState | undefined {
  const investmentFlow = state.investmentFlow;
  const value = investmentFlow.euroValueUlps;
  const wallet = state.wallet.data;
  const contribs = selectCalculatedContributionByEtoId(investmentFlow.etoId, state.publicEtos);

  if (!contribs || !value || !wallet) return;

  const gasPrice = selectInvestmentGasCostEth(investmentFlow);

  if (compareBigNumbers(gasPrice, wallet.etherBalance) === 1) {
    return EInvestmentErrorState.NotEnoughEtherForGas;
  }

  const etherValue = divideBigNumbers(value, selectEtherPriceEur(state.tokenPrice));

  if (investmentFlow.investmentType === EInvestmentType.InvestmentWallet) {
    if (
      compareBigNumbers(
        addBigNumbers([etherValue, gasPrice]),
        selectLiquidEtherBalance(state.wallet),
      ) === 1
    ) {
      return EInvestmentErrorState.ExceedsWalletBalance;
    }
  }

  if (compareBigNumbers(value, contribs.minTicketEurUlps) === -1) {
    return EInvestmentErrorState.BelowMinimumTicketSize;
  }

  if (compareBigNumbers(value, contribs.maxTicketEurUlps) === 1) {
    return EInvestmentErrorState.AboveMaximumTicketSize;
  }

  if (contribs.maxCapExceeded) {
    return EInvestmentErrorState.ExceedsTokenAmount;
  }

  return;
}

function* validateAndCalculateInputs({ contractsService }: TGlobalDependencies): any {
  // debounce validation
  yield delay(300);

  let state: IAppState = yield select();
  const eto = selectEtoById(state.publicEtos, state.investmentFlow.etoId);
  const value = state.investmentFlow.euroValueUlps;
  if (value && eto) {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
    if (etoContract) {
      const isICBM = selectIsICBMInvestment(state.investmentFlow);
      yield neuCall(loadComputedContributionFromContract, eto, value, isICBM);
      state = yield select();
      yield put(actions.investmentFlow.setErrorState(validateInvestment(state)));
      yield put(actions.investmentFlow.setIsInputValidated(true));
    }
  } else {
    yield put(actions.investmentFlow.setErrorState());
  }
}

function* start(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_START") return;
  yield put(actions.investmentFlow.resetInvestment());
  yield put(actions.investmentFlow.setEtoId(action.payload.etoId));
  yield put(actions.kyc.kycLoadClientData());
  yield put(actions.gas.gasApiEnsureLoading());
  yield put(actions.txSender.startInvestment());
  yield setGasPrice();
}

function* onTxModalHide(): any {
  const state: IInvestmentFlowState = yield select((s: IAppState) => s.investmentFlow)
  if (!selectIsBankTransferModalOpened(state)) {
    yield put(actions.investmentFlow.resetInvestment());
  }
}

function* setGasPrice(): any {
  const gas: IGasState = yield select((s: IAppState) => s.gas);
  yield put(actions.investmentFlow.setGasPrice(gas.gasPrice && gas.gasPrice.standard));
  yield put(actions.investmentFlow.validateInputs());
}

function* generateTransaction({ contractsService }: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const i = state.investmentFlow;
  const eto = selectEtoById(state.publicEtos, i.etoId);

  if (!eto || !selectReadyToInvest(i)) {
    throw new Error("Investment data is not valid to create an Transaction");
  }

  let txDetails: ITxData | undefined;

  if (i.investmentType === EInvestmentType.InvestmentWallet) {
    const etherTokenBalance = state.wallet.data!.etherTokenBalance;

    // transaction can be fully covered by etherTokens
    if (compareBigNumbers(etherTokenBalance, i.ethValueUlps) >= 0) {
      // need to call 3 args version of transfer method. See the abi in the contract.
      // so we call the rawWeb3Contract directly
      const txInput = contractsService.etherToken.rawWeb3Contract.transfer[
        "address,uint256,bytes"
      ].getData(eto.etoId, i.ethValueUlps, "");

      txDetails = {
        to: contractsService.etherToken.address,
        from: selectEthereumAddressWithChecksum(state.web3),
        input: txInput,
        value: "0",
        gas: i.gasAmount,
        gasPrice: i.gasPrice,
      };

      // fill up etherToken with ether from walle}t
    } else {
      const ethVal = new BigNumber(i.ethValueUlps);
      const difference = ethVal.sub(etherTokenBalance);
      const txCall = contractsService.etherToken.depositAndTransferTx(eto.etoId, ethVal, [""]);
      txDetails = {
        to: contractsService.etherToken.address,
        from: selectEthereumAddressWithChecksum(state.web3),
        input: txCall.getData(),
        value: difference.round().toString(),
        gas: i.gasAmount,
        gasPrice: i.gasPrice,
      };
    }
  }

  if (txDetails) {
    yield put(actions.txSender.txSenderAcceptDraft(txDetails));
  }
}

function* recalculateCurrencies(): any {
  yield delay(100); // wait for new token price to be available
  const i: IInvestmentFlowState = yield select((s: IAppState) => s.investmentFlow);
  const curr = selectCurrencyByInvestmentType(i);
  if (curr === EInvestmentCurrency.Ether && i.ethValueUlps) {
    yield computeAndSetCurrencies(i.ethValueUlps, curr);
  } else if (i.euroValueUlps) {
    yield computeAndSetCurrencies(i.euroValueUlps, curr);
  }
}

function* showBankTransferDetails(): any {
  const state: IInvestmentFlowState = yield select((s: IAppState) => s.investmentFlow)
  if (state.investmentType !== EInvestmentType.BankTransfer) return
  yield put(actions.investmentFlow.setBankTransferFlowState(EBankTransferFlowState.Details))
  yield put(actions.txSender.txSenderHideModal())
}

function* showBankTransferSummary(): any {
  const state: IInvestmentFlowState = yield select((s: IAppState) => s.investmentFlow)
  if (state.investmentType !== EInvestmentType.BankTransfer) return
  yield put(actions.investmentFlow.setBankTransferFlowState(EBankTransferFlowState.Summary))
}

export function* investmentFlowSagas(): any {
  yield takeEvery("INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE", processCurrencyValue);
  yield takeLatest("INVESTMENT_FLOW_VALIDATE_INPUTS", neuCall, validateAndCalculateInputs);
  yield takeEvery("INVESTMENT_FLOW_START", start);
  yield fork(neuTakeEvery, "INVESTMENT_FLOW_GENERATE_TX", generateTransaction);
  yield takeEvery("INVESTMENT_FLOW_SHOW_BANK_TRANSFER_DETAILS", showBankTransferDetails);
  yield takeEvery("INVESTMENT_FLOW_SHOW_BANK_TRANSFER_SUMMARY", showBankTransferSummary);

  yield takeEvery("TX_SENDER_HIDE_MODAL", onTxModalHide);
  yield takeEvery("GAS_API_LOADED", setGasPrice);
  yield takeEvery("GAS_API_LOADED", setGasPrice);
  yield takeEvery("TOKEN_PRICE_SAVE", recalculateCurrencies);
}
