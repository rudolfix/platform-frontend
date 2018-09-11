import BigNumber from "bignumber.js";
import { delay } from "redux-saga";
import { fork, put, select, takeEvery, takeLatest } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { IAppState } from "../../store";
import { addBigNumbers, compareBigNumbers, divideBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Money.utils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TAction } from "../actions";
import { IGasState } from "../gas/reducer";
import { loadComputedContributionFromContract } from "../public-etos/sagas";
import { selectCurrentCalculatedContribution, selectCurrentEto } from "../public-etos/selectors";
import { neuCall, neuTakeEvery } from "../sagas";
import { selectEtherPriceEur } from "../shared/tokenPrice/selectors";
import { ITxData } from "../tx/sender/reducer";
import { selectLiquidEtherBalance } from "../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import {
  EInvestmentCurrency,
  EInvestmentErrorState,
  EInvestmentType,
  IInvestmentFlowState,
} from "./reducer";
import {
  selectCurrencyByInvestmentType,
  selectInvestmentGasCostEth,
  selectIsICBMInvestment,
  selectReadyToInvest,
} from "./selectors";

function* processCurrencyValue(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE") return;
  const state: IAppState = yield select();
  const i = state.investmentFlow;
  const type = i.investmentType;
  let value = extractNumber(action.payload.value);

  // Dont allow setting values, if no investment type is selected
  if (value && type === EInvestmentType.None) {
    yield put(actions.investmentFlow.setErrorState(EInvestmentErrorState.NoWalletSelected));
    return;
  } else if (
    type !== EInvestmentType.None &&
    i.errorState === EInvestmentErrorState.NoWalletSelected
  ) {
    yield put(actions.investmentFlow.setErrorState());
  }

  yield put(actions.investmentFlow.setIsInputValidated(false))
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
  const i = state.investmentFlow;
  const value = i.euroValueUlps;
  const wallet = state.wallet.data;
  const contribs = selectCurrentCalculatedContribution(state.publicEtos);

  if (!contribs || !value || !wallet) return;

  const gasPrice = selectInvestmentGasCostEth(i);

  if (compareBigNumbers(gasPrice, wallet.etherBalance) === 1) {
    return EInvestmentErrorState.NotEnoughEtherForGas;
  }

  const etherValue = divideBigNumbers(value, selectEtherPriceEur(state.tokenPrice));

  if (i.investmentType === EInvestmentType.InvestmentWallet) {
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
  const eto = selectCurrentEto(state.publicEtos)
  const value = state.investmentFlow.euroValueUlps;
  if (value && eto) {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId);
    if (etoContract) {
      const isICBM = selectIsICBMInvestment(state.investmentFlow);
      yield neuCall(loadComputedContributionFromContract, eto, value, isICBM)
      state = yield select();
      yield put(actions.investmentFlow.setErrorState(validateInvestment(state)));
      yield put(actions.investmentFlow.setIsInputValidated(true))
    }
  } else {
    yield put(actions.investmentFlow.setErrorState());
  }
}

function* start(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_START") return;
  yield put(actions.investmentFlow.investmentReset());
  yield put(actions.gas.gasApiEnsureLoading());
  yield put(actions.txSender.startInvestment());
  yield setGasPrice();
}

function* stop(): any {
  const type: EInvestmentType = yield select((s: IAppState) => s.investmentFlow.investmentType);
  if (type !== EInvestmentType.None) {
    yield put(actions.investmentFlow.investmentReset());
  }
}

function* setGasPrice(): any {
  const gas: IGasState = yield select((s: IAppState) => s.gas);
  yield put(actions.investmentFlow.setGasPrice(gas.gasPrice && gas.gasPrice.standard));
  yield put(actions.investmentFlow.validateInputs());
}

function* generateTransaction({ contractsService }: TGlobalDependencies): any {
  const state: IAppState = yield select();
  const eto = selectCurrentEto(state.publicEtos)
  if (!eto || !selectReadyToInvest(state.investmentFlow)) {
    throw new Error("Investment data is not valid to create an Transaction");
  }
  const i = state.investmentFlow;

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

function * cancelInvestment (): any {
  yield put(actions.txSender.txSenderHideModal())
}

export function* investmentFlowSagas(): any {
  yield takeEvery("INVESTMENT_FLOW_SUBMIT_INVESTMENT_VALUE", processCurrencyValue);
  yield takeLatest("INVESTMENT_FLOW_VALIDATE_INPUTS", neuCall, validateAndCalculateInputs);
  yield takeEvery("INVESTMENT_FLOW_START", start);
  yield fork(neuTakeEvery, "INVESTMENT_FLOW_GENERATE_TX", generateTransaction);
  yield takeEvery("TX_SENDER_HIDE_MODAL", stop);
  yield takeEvery("PUBLIC_ETOS_SET_CURRENT_ETO", cancelInvestment); // cancel when current eto changes
  yield takeEvery("GAS_API_LOADED", setGasPrice);
  yield takeEvery("GAS_API_LOADED", setGasPrice);
  yield takeEvery("TOKEN_PRICE_SAVE", recalculateCurrencies);
}
