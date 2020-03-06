import { all, call, fork, getContext } from "@neufund/sagas";

import { TGlobalDependencies } from "../di/setupBindings";
import { initSaga } from "./init/sagas";

function* allSagas(): Generator<any, any, any> {
  yield all([fork(initSaga)]);
}

function* handleRootError(error: Error): Generator<any, any, any> {
  const { logger }: TGlobalDependencies = yield getContext("deps");

  logger.error(error);
}

export function* rootSaga(): Generator<any, any, any> {
  while (true) {
    try {
      yield call(allSagas);
    } catch (e) {
      yield call(handleRootError, e);
    }
  }
}
