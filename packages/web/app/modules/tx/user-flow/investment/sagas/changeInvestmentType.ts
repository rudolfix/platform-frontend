import { call, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../../../actions";
import { reinitInvestmentView } from "./reinitInvestmentView";

export function* changeInvestmentType(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.setInvestmentType>,
): Generator<any, any, any> {
  yield put(actions.txUserFlowInvestment.setInvestmentType(payload.investmentType));

  const viewData = yield call(reinitInvestmentView);
  yield put(actions.txUserFlowInvestment.setViewData(viewData));
}
