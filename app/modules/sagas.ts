import { effects } from "redux-saga";

import { call, spawn, takeEvery } from "redux-saga/effects";
import { TGlobalDependencies } from "../di/setupBindings";
import { TAction } from "./actions";
import { authSagas } from "./auth/sagas";
import { dashboardSagas } from "./dashboard/sagas";
import { etoDocumentsSagas } from "./eto-documents/sagas";
import { etoFlowSagas } from "./eto-flow/sagas";
import { etoSagas } from "./eto/sagas";
import { gasApiSagas } from "./gas/sagas";
import { immutableFileSagas } from "./immutableFile/sagas";
import { initSagas } from "./init/sagas";
import { kycSagas } from "./kyc/sagas";
import { settingsSagas } from "./settings/sagas";
import { formSingleFileUploadSagas } from "./shared/formSingleFileUpload/sagas";
import { remoteFileSagas } from "./shared/remoteFile/sagas";
import { txMonitorSagas } from "./tx/monitor/sagas";
import { txSendingSagasWatcher } from "./tx/sender/sagas";
import { lightWalletSagas } from "./wallet-selector/light-wizard/sagas";
import { walletSelectorSagas } from "./wallet-selector/sagas";
import { walletSagas } from "./wallet/sagas";
import { web3Sagas } from "./web3/sagas";

/**
 * Restart all sagas on error and report error to sentry
 */
function* allSagas(): Iterator<effects.Effect> {
  yield effects.all([
    effects.fork(kycSagas),
    effects.fork(initSagas),
    effects.fork(dashboardSagas),
    effects.fork(settingsSagas),
    effects.fork(web3Sagas),
    effects.fork(authSagas),
    effects.fork(walletSelectorSagas),
    effects.fork(lightWalletSagas),
    effects.fork(walletSagas),
    effects.fork(etoFlowSagas),
    effects.fork(immutableFileSagas),
    effects.fork(etoSagas),
    effects.fork(formSingleFileUploadSagas),
    effects.fork(remoteFileSagas),
    effects.fork(txSendingSagasWatcher),
    effects.fork(txSendingSagasWatcher),
    effects.fork(gasApiSagas),
    effects.fork(etoDocumentsSagas),
    effects.fork(txMonitorSagas),
  ]);
}

export function* rootSaga(): Iterator<effects.Effect> {
  while (true) {
    try {
      yield effects.call(allSagas);
    } catch (e) {
      // tslint:disable-next-line
      console.error("ERROR IN TOP LEVEL SAGA HANDLER", e);
    }
  }
}

/**
 * Helpers
 */
type TActionType = TAction["type"];

export function* neuTakeEvery(
  type: TActionType | Array<string>,
  saga: (deps: TGlobalDependencies, action: TAction) => any,
): Iterator<effects.Effect> {
  const deps: TGlobalDependencies = yield effects.getContext("deps");
  yield takeEvery(type, saga, deps);
}

export function* neuFork(
  saga: (deps: TGlobalDependencies, ...args: any[]) => any,
  ...args: any[]
): Iterator<effects.Effect> {
  const deps: TGlobalDependencies = yield effects.getContext("deps");
  return yield spawn(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}

export function* neuCall(
  saga: (deps: TGlobalDependencies, ...args: any[]) => any,
  ...args: any[]
): Iterator<effects.Effect> {
  const deps: TGlobalDependencies = yield effects.getContext("deps");
  return yield call(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}
