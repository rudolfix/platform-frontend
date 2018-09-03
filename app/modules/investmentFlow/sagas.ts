import BigNumber from "bignumber.js";
import { fork, put, select, takeEvery, throttle } from "redux-saga/effects";

import { EIDRM } from "constants";
import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { IAppState } from "../../store";
import { addBigNumbers, compareBigNumbers, multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Money.utils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TAction } from "../actions";
import { neuCall } from "../sagas";
import { selectLiquidEtherBalance } from "../wallet/selectors";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { EInvestmentErrorState, EInvestmentType, IInvestmentFlowState } from "./reducer";
import { convertToCalculatedContribution, selectInvestmentGasCost, selectIsICBMInvestment } from "./selectors";

function* calculateValueFromEth(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SUBMIT_INVESTMENT_ETH_VALUE") return;
  const s: IAppState = yield select()
  const eth = extractNumber(action.payload.value) || "0"
  const tp = s.tokenPrice.tokenPriceData
  if (tp) {
    const value = multiplyBigNumbers([eth, tp.etherPriceEur])
    yield put(actions.investmentFlow.submitEuroValue(value === "0" ? "" : value))
  }
}

function* validateEuroValue(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SUBMIT_INVESTMENT_EUR_VALUE") return;
  const state: IAppState = yield select()
  const type = state.investmentFlow.investmentType
  let value = extractNumber(action.payload.value)
  if (value && type === EInvestmentType.None) {
    yield put(actions.investmentFlow.setErrorState(EInvestmentErrorState.NoWalletSelected))
    return
  }
  value = value && convertToBigInt(value)
  yield put(actions.investmentFlow.setErrorState())
  yield put(actions.investmentFlow.setEuroValue(value))
  yield put(actions.investmentFlow.validateInputs())
}

function validateInvestment(state: IAppState): EInvestmentErrorState | undefined {
  const i = state.investmentFlow
  const value = i.euroValueUlps
  const wallet = state.wallet.data
  const eto = i.eto
  const contribs = i.calculatedContribution

  if (!eto || !contribs || !value || !wallet) return

  const gasPrice = selectInvestmentGasCost(i)

  if (compareBigNumbers(gasPrice, wallet.etherBalance) === 1) {
    return EInvestmentErrorState.NotEnoughEtherForGas
  }

  if (i.investmentType === EInvestmentType.InvestmentWallet) {
    if (compareBigNumbers(addBigNumbers([value, gasPrice]), selectLiquidEtherBalance(state.wallet)) === 1) {
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
  const state: IAppState = yield select()
  const eto = state.investmentFlow.eto
  const value = state.investmentFlow.euroValueUlps
  if (value && eto) {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId)
    if (etoContract) {
      const from = selectEthereumAddressWithChecksum(state.web3)
      const isICBM = selectIsICBMInvestment(state.investmentFlow)
      const calculation = yield etoContract.calculateContribution(from, isICBM, new BigNumber(value))
      yield put(actions.investmentFlow.setCalculatedContribution(convertToCalculatedContribution(calculation)))
      yield put(actions.investmentFlow.setErrorState(validateInvestment(state)))
    }
  } else {
    yield put(actions.investmentFlow.setCalculatedContribution())
  }
}

function* start(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_START") return
  yield put(actions.investmentFlow.investmentReset())
  yield put(actions.gas.gasApiEnsureLoading())
  yield put(actions.investmentFlow.setEto(action.payload.eto))
  yield put(actions.txSender.startInvestment())
}

function* stop(): any {
  const type: EInvestmentType = yield select((s: IAppState) => s.investmentFlow.investmentType)
  if (type !== EInvestmentType.None) {
    yield put(actions.investmentFlow.investmentReset())
  }
}

export function* investmentFlowSagas(): any {
  yield takeEvery("INVESTMENT_FLOW_SUBMIT_INVESTMENT_ETH_VALUE", calculateValueFromEth)
  yield takeEvery("INVESTMENT_FLOW_SUBMIT_INVESTMENT_EUR_VALUE", validateEuroValue)
  yield throttle(300, "INVESTMENT_FLOW_VALIDATE_INPUTS", neuCall, validateAndCalculateInputs)
  yield takeEvery("INVESTMENT_FLOW_START", start)
  yield takeEvery("TX_SENDER_HIDE_MODAL", stop)
}
