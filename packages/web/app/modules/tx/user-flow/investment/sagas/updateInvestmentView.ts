import { call, put, select } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../../../actions";
import { selectTxUserFlowInvestmentState } from "../selectors";
import { EInvestmentValueType, TTxUserFlowInvestmentReadyState } from "../types";
import { generateUpdatedView } from "./generateUpdatedView";
import { validateInvestmentValue } from "./validateInvestmentValue";

export function* updateInvestmentView(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.updateValue>,
): Generator<any, any, any> {
  const {
    investmentCurrency,
    investmentValue: oldValue,
    investmentType,
    etoId,
  }: TTxUserFlowInvestmentReadyState = yield select(selectTxUserFlowInvestmentState);

  if (payload.value === oldValue) {
    return;
  } else {
    // many api calls ahead, set investment value to show it in the UI in the meantime
    yield put(actions.txUserFlowInvestment.setInvestmentValue(payload.value));
    yield put(actions.txUserFlowInvestment.setFormStateValidating());

    const validationResult = yield call(validateInvestmentValue, {
      value: payload.value,
      investmentCurrency,
      investmentType,
      etoId,
      investmentValueType: EInvestmentValueType.PARTIAL_BALANCE,
    });
    const investmentCalculatedData = yield call(
      generateUpdatedView,
      validationResult,
      EInvestmentValueType.PARTIAL_BALANCE,
      payload.value,
    );
    yield put(actions.txUserFlowInvestment.setViewData(investmentCalculatedData));
  }
}
