import { put, select, take } from "redux-saga/effects";

import { TGlobalDependencies } from "../../../../../di/setupBindings";
import { EProcessState } from "../../../../../utils/enums/processStates";
import { actions, TActionFromCreator } from "../../../../actions";
import { neuCall } from "../../../../sagasUtils";
import { selectTxUserFlowInvestmentState } from "../selectors";
import { getInvestmentInitViewData } from "./getInvestmentInitViewData";

export function* initInvestmentView(
  _: TGlobalDependencies,
  { payload }: TActionFromCreator<typeof actions.txUserFlowInvestment.startInvestment>,
): Generator<any, any, any> {
  //start the tx sagas and wait until txSendProcess opens the modal. This is for backwards compatibility
  //todo refactor transaction flow to not deal with modals and UI in general
  yield put(actions.txTransactions.startInvestment(payload.etoId));
  yield take(actions.txSender.txSenderShowModal);

  const { processState } = yield select(selectTxUserFlowInvestmentState);

  if (processState === EProcessState.NOT_STARTED) {
    yield put(actions.txUserFlowInvestment.setEtoId(payload.etoId));
    const initialViewData = yield neuCall(getInvestmentInitViewData);
    yield put(actions.txUserFlowInvestment.setViewData(initialViewData));
  }
}
