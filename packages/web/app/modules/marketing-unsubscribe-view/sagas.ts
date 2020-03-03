import { fork, put } from "@neufund/sagas";
import { marketingEmailsModuleApi } from "@neufund/shared-modules";

import { actions } from "../actions";
import { neuTakeEvery } from "../sagasUtils";

export function* unsubscribeSuccess(): Generator<any, any, any> {
  yield put(actions.routing.goToUnsubscriptionSuccess());
}
export function* unsubscribeFailure(): Generator<any, any, any> {
  yield put(actions.routing.goHome());
}

export function* marketingUnsubscribeView(): Generator<any, any, any> {
  yield fork(neuTakeEvery, marketingEmailsModuleApi.actions.unsubscribeSuccess, unsubscribeSuccess);
  yield fork(neuTakeEvery, marketingEmailsModuleApi.actions.unsubscribeFailure, unsubscribeFailure);
}
