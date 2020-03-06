import { all, call, fork, getContext, put } from "@neufund/sagas";
import { TGlobalDependencies } from "../di/setupBindings";
import { initSaga } from "./init/sagas";
import { initActions } from "./init/actions";


function* allSagas(): Generator<any, any, any> {
  yield all([fork(initSaga)]);
  // TODO: replace with real wallet storage
  const { appStorage }: TGlobalDependencies = yield getContext("deps");
  const { singleKeyAppStorage }: TGlobalDependencies = yield getContext("deps");

  const type = yield appStorage.getItem("test");
  yield put(initActions.db(type.data));

  const wallet = yield singleKeyAppStorage.getItem();
  console.log("Active wallet", wallet);
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
