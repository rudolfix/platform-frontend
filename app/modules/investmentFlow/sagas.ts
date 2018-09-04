import BigNumber from "bignumber.js";
import { delay } from "redux-saga";
import { fork, put, select, takeEvery, takeLatest, throttle } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { IAppState } from "../../store";
import { addBigNumbers, compareBigNumbers, divideBigNumbers, multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Money.utils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TAction } from "../actions";
import { IGasState } from "../gas/reducer";
import { neuCall } from "../sagas";
import { selectEtherPriceEur } from "../shared/tokenPrice/selectors";
import { selectLiquidEtherBalance } from "../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { EInvestmentErrorState, EInvestmentType, IInvestmentFlowState } from "./reducer";
import { convertToCalculatedContribution, selectInvestmentGasCost, selectIsICBMInvestment } from "./selectors";

function* calculateEuroValueFromEth(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SUBMIT_INVESTMENT_ETH_VALUE") return;
  const s: IAppState = yield select()
  const eth = extractNumber(action.payload.value) || "0"
  const tp = s.tokenPrice.tokenPriceData
  if (tp) {
    const value = multiplyBigNumbers([eth, tp.etherPriceEur])
    yield put(actions.investmentFlow.submitEuroValue(value === "0" ? "" : value))
  }
}

function* processEuroValue(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SUBMIT_INVESTMENT_EUR_VALUE") return;
  const state: IAppState = yield select()
  const i = state.investmentFlow
  const type = i.investmentType
  let value = extractNumber(action.payload.value)
  if (value && type === EInvestmentType.None) {
    yield put(actions.investmentFlow.setErrorState(EInvestmentErrorState.NoWalletSelected))
    return
  }
  if (type !== EInvestmentType.None && i.errorState === EInvestmentErrorState.NoWalletSelected) {
    yield put(actions.investmentFlow.setErrorState())
  }
  value = value && convertToBigInt(value)
  yield put(actions.investmentFlow.setEuroValue(value))
  yield put(actions.investmentFlow.validateInputs())
}

function validateInvestment(state: IAppState): EInvestmentErrorState | undefined {
  const i = state.investmentFlow
  const value = i.euroValueUlps
  const wallet = state.wallet.data
  const contribs = i.calculatedContribution

  if (!contribs || !value || !wallet) return

  const gasPrice = selectInvestmentGasCost(i)

  if (compareBigNumbers(gasPrice, wallet.etherBalance) === 1) {
    return EInvestmentErrorState.NotEnoughEtherForGas
  }

  const etherValue = divideBigNumbers(value, selectEtherPriceEur(state.tokenPrice))

  if (i.investmentType === EInvestmentType.InvestmentWallet) {
    if (compareBigNumbers(addBigNumbers([etherValue, gasPrice]), selectLiquidEtherBalance(state.wallet)) === 1) {
      return EInvestmentErrorState.ExceedsWalletBalance
    }
  }

  if (compareBigNumbers(value, contribs.minTicketEurUlps) === -1) {
    return EInvestmentErrorState.BelowMinimumTicketSize
  }

  if (compareBigNumbers(value, contribs.maxTicketEurUlps) === 1) {
    return EInvestmentErrorState.AboveMaximumTicketSize
  }

  if (contribs.maxCapExceeded) {
    return EInvestmentErrorState.ExceedsTokenAmount
  }

  return
}

function * validateAndCalculateInputs({contractsService}: TGlobalDependencies): any {
  // debounce validation
  yield delay(300)

  let state: IAppState = yield select()
  const eto = state.investmentFlow.eto
  const value = state.investmentFlow.euroValueUlps
  if (value && eto) {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId)
    if (etoContract) {
      const from = selectEthereumAddressWithChecksum(state.web3)
      const isICBM = selectIsICBMInvestment(state.investmentFlow)
      const calculation = yield etoContract.calculateContribution(from, isICBM, new BigNumber(value))
      yield put(actions.investmentFlow.setCalculatedContribution(convertToCalculatedContribution(calculation)))
      state = yield select()
      yield put(actions.investmentFlow.setErrorState(validateInvestment(state)))
    }
  } else {
    yield put(actions.investmentFlow.setCalculatedContribution())
    yield put(actions.investmentFlow.setErrorState())
  }
}

function* start(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_START") return
  yield put(actions.investmentFlow.investmentReset())
  yield put(actions.gas.gasApiEnsureLoading())
  yield put(actions.investmentFlow.setEto(action.payload.eto))
  yield put(actions.txSender.startInvestment())
  yield setGasPrice()
}

function* stop(): any {
  const type: EInvestmentType = yield select((s: IAppState) => s.investmentFlow.investmentType)
  if (type !== EInvestmentType.None) {
    yield put(actions.investmentFlow.investmentReset())
  }
}

function * setGasPrice (): any {
  const gas: IGasState = yield select((s: IAppState) => s.gas)
  yield put(actions.investmentFlow.setGasPrice(gas.gasPrice && gas.gasPrice.standard))
  yield put(actions.investmentFlow.validateInputs())
}

export function* investmentFlowSagas(): any {
  yield takeEvery("INVESTMENT_FLOW_SUBMIT_INVESTMENT_ETH_VALUE", calculateEuroValueFromEth)
  yield takeEvery("INVESTMENT_FLOW_SUBMIT_INVESTMENT_EUR_VALUE", processEuroValue)
  yield takeLatest("INVESTMENT_FLOW_VALIDATE_INPUTS", neuCall, validateAndCalculateInputs)
  yield takeEvery("INVESTMENT_FLOW_START", start)
  yield takeEvery("TX_SENDER_HIDE_MODAL", stop)
  yield takeEvery("GAS_API_LOADED", setGasPrice)
}
