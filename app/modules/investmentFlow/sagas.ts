import { fork, put, select, takeEvery } from "redux-saga/effects";

import { IAppState } from "../../store";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { extractNumber } from "../../utils/StringUtils";
import { actions, TAction } from "../actions";

function* calculateValueFromEth(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SET_INVESTMENT_ETH_VALUE") return;
  const s: IAppState = yield select()
  const eth = extractNumber(action.payload.value) || "0"
  const tp = s.tokenPrice.tokenPriceData
  if (tp) {
    const value = multiplyBigNumbers([eth, tp.etherPriceEur])
    yield put(actions.investmentFlow.setEuroValue(value))
  }
}

function* start(action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_START") return
  yield put(actions.investmentFlow.investmentReset())
  yield put(actions.gas.gasApiEnsureLoading())
  yield put(actions.investmentFlow.setEto(action.payload.eto))
}

export function* investmentFlowSagas(): any {
  yield fork(takeEvery, "INVESTMENT_FLOW_SET_INVESTMENT_ETH_VALUE", calculateValueFromEth)
  yield fork(takeEvery, "INVESTMENT_FLOW_START", start)
}
