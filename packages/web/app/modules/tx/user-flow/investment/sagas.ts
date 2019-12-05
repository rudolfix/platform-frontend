import { actions, TActionFromCreator } from "../../../actions";
import { fork } from "redux-saga/effects";
import { neuTakeLatest } from "../../../sagasUtils";

function* investmentViewSaga (
  {payload}: TActionFromCreator<typeof actions.txUserFlowInvestment.setResult>
) {

}

export const txUserFlowInvestmentSagas = function*(): Iterator<any> {
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.setResult, investmentViewSaga);
};
