import { all, call, fork, getContext } from "@neufund/sagas";

import { TGlobalDependencies } from "../di/setupBindings";
import { initSaga } from "./init/sagas";

function* allSagas(): Generator<unknown, void> {
  yield all([fork(initSaga)]);
}

function* handleRootError(error: Error): Generator<unknown, void> {
  const { logger } = yield* getContext<TGlobalDependencies>("deps");

  logger.error(error);
}

export function* rootSaga(): Generator<unknown, void> {
  while (true) {
    try {
      yield call(allSagas);
    } catch (e) {
      yield call(handleRootError, e);
    }
  }
}
