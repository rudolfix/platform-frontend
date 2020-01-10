import { fork } from "@neufund/sagas";

import { actions } from "../../../actions";
import { neuTakeLatest } from "../../../sagasUtils";
import { changeInvestmentWallet } from "./sagas/changeInvestmentWallet";
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
    actions.txUserFlowInvestment.changeInvestmentWallet,
    changeInvestmentWallet,
  );
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.investEntireBalance, investEntireBalance);
  yield fork(neuTakeLatest, actions.txUserFlowInvestment.submitInvestment, submitInvestment);
  yield fork(neuTakeLatest, actions.txSender.txSenderHideModal, cleanupInvestmentView);
};
