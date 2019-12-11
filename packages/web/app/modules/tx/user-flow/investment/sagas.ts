import { fork } from "redux-saga/effects";

import { actions } from "../../../actions";
import { neuTakeLatest } from "../../../sagasUtils";
import { changeInvestmentType } from "./sagas/changeInvestmentType";
import { cleanupInvestmentView } from "./sagas/cleanupInvestmentView";
import { initInvestmentView } from "./sagas/initInvestmentView";
import { investEntireBalance } from "./sagas/investEntireBalance";
import { recalculateView } from "./sagas/recalculateView";
import { submitInvestment } from "./sagas/submitInvestment";
import { updateInvestmentView } from "./sagas/updateInvestmentView";

export const txUserFlowInvestmentSagas = function*(): Generator<any, any, any> {
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.startInvestment, initInvestmentView);
  yield fork(neuTakeLatest, "TOKEN_PRICE_SAVE", recalculateView);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.updateValue, updateInvestmentView);
  yield fork(
    neuTakeLatest,
    actions.txUserFlowInvestment.changeInvestmentType,
    changeInvestmentType,
  );
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.investEntireBalance, investEntireBalance);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.submitInvestment, submitInvestment);
  yield fork(neuTakeLatest, actions.txSender.txSenderHideModal, cleanupInvestmentView);
};
