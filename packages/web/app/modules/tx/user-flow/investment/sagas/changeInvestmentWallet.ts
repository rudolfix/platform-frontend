import { call, put } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { actions, TActionFromCreator } from "../../../../actions";
import { reinitInvestmentView } from "./reinitInvestmentView";

export function* changeInvestmentWallet(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.changeInvestmentWallet>,
): Generator<any, any, any> {
    yield put(actions.txUserFlowInvestment.setInvestmentWallet(payload.investmentWallet));

    const viewData = yield call(reinitInvestmentView);
    yield put(actions.txUserFlowInvestment.setViewData(viewData));
}
