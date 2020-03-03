import { neuTakeLatest, put, fork } from "@neufund/sagas";

import { TGlobalDependencies } from "../../di/setupBindings";
import { initActions } from "./actions";

export function* initStartSaga({ logger }: TGlobalDependencies): Generator<any, void, any> {
  try {
    // TODO: Provide a proper init flow

    yield put(initActions.done());
  } catch (e) {
    yield put(initActions.error(e?.message ?? "Unknown error"));
    logger.error("App init error", e);
  }
}

export function* initSaga(): Generator<any, void, any> {
  yield fork(neuTakeLatest, initActions.start, initStartSaga);
}
