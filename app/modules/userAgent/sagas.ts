import { effects } from "redux-saga";
import { fork, put } from "redux-saga/effects";
import { TGlobalDependencies } from "../../di/setupBindings";
import { actions } from "../actions";
import { neuTakeEvery } from "../sagas";

function* detectUserAgent({ detectBrowser }: TGlobalDependencies): any {
  const userAgentInfo = detectBrowser();
  yield put(actions.userAgent.loadUserAgentInfo(userAgentInfo.name, userAgentInfo.version));
}

export const userAgentSagas = function*(): Iterator<effects.Effect> {
  yield fork(neuTakeEvery, "INIT_START", detectUserAgent);
};
