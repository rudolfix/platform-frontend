import BigNumber from "bignumber.js";
import { fork, put, select, takeEvery } from "redux-saga/effects";

import { throttle } from "redux-saga";
import { TGlobalDependencies } from "../../di/setupBindings";
import { ETOCommitment } from "../../lib/contracts/ETOCommitment";
import { IAppState } from "../../store";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { convertToBigInt } from "../../utils/Money.utils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TAction } from "../actions";
import { neuCall } from "../sagas";
import { selectEthereumAddressWithChecksum } from "../web3/selectors";
import { EInvestmentErrorState, EInvestmentType } from "./reducer";
import { convertToCalculatedContribution, selectIsICBMInvestment } from "./selectors";

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
  const type = yield select((s: IAppState) => s.investmentFlow.investmentType)
  let value = extractNumber(action.payload.value)
  if (value && type === EInvestmentType.None) {
    yield put(actions.investmentFlow.setErrorState(EInvestmentErrorState.NoWalletSelected))
    return
  }
  value = value && convertToBigInt(value)
  yield put(actions.investmentFlow.setErrorState())
  yield put(actions.investmentFlow.setEuroValue(value))
  yield put(actions.investmentFlow.calculateContribution())
}

function * getCalculatedContribution({contractsService}: TGlobalDependencies): any {
  const state: IAppState = yield select()
  const eto = state.investmentFlow.eto
  const value = state.investmentFlow.euroValue
  if (value && eto) {
    const etoContract: ETOCommitment = yield contractsService.getETOCommitmentContract(eto.etoId)
    if (etoContract) {
      const from = selectEthereumAddressWithChecksum(state.web3)
      const isICBM = selectIsICBMInvestment(state.investmentFlow)
      const calculation = yield etoContract.calculateContribution(from, isICBM, new BigNumber(value))
      yield put(actions.investmentFlow.setCalculatedContribution(convertToCalculatedContribution(calculation)))
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
}

export function* investmentFlowSagas(): any {
  yield fork(takeEvery, "INVESTMENT_FLOW_SUBMIT_INVESTMENT_ETH_VALUE", calculateValueFromEth)
  yield fork(takeEvery, "INVESTMENT_FLOW_SUBMIT_INVESTMENT_EUR_VALUE", validateEuroValue)
  yield fork(takeEvery, "INVESTMENT_FLOW_START", start)
  yield fork(throttle, 300, "INVESTMENT_FLOW_CALCULATE_CONTRIBUTION", neuCall, getCalculatedContribution)
}
