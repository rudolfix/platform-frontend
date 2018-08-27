import { fork, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../di/setupBindings";
import { multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { actions, TAction } from "../actions";
import { neuTakeEvery } from "../sagas";

export function* calculateValueFromEth({getState}: TGlobalDependencies, action: TAction): any {
  if (action.type !== "INVESTMENT_FLOW_SET_INVESTMENT_ETH_VALUE") return;
  const s = getState()
  const eth = action.payload.value
  const tp = s.tokenPrice.tokenPriceData
  if (tp) {
    const value = multiplyBigNumbers([eth, tp.etherPriceEur])
    put(actions.investmentFlow.setEuroValue(value))
  }
}

export function* investmentFlowSagas(): any {
  yield fork(neuTakeEvery, "INVESTMENT_FLOW_SET_INVESTMENT_ETH_VALUE", calculateValueFromEth)
}
