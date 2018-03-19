import { effects } from "redux-saga";
import { TAction } from "./actions";

import { Container } from "inversify";
import { call, fork, takeEvery } from "redux-saga/effects";
import { TGlobalDependencies } from "../di/setupBindings";
import { getDependencies } from "../middlewares/redux-injectify";
import { FunctionWithDeps } from "../types";
import { authSagas } from "./auth/sagas";
import { dashboardSagas } from "./dashboard/sagas";
import { initSagas } from "./init/sagas";
import { kycSagas } from "./kyc/sagas";
import { lightWalletSagas } from "./wallet-selector/light-wizard/sagas";
import { walletSelectorSagas } from "./wallet-selector/sagas";
import { web3Sagas } from "./web3/sagas";

/**
 * Restart all sagas on error and report error to sentry
 */
function* allSagas(): Iterator<effects.Effect> {
  yield effects.all([
    effects.fork(kycSagas),
    effects.fork(initSagas),
    effects.fork(walletSelectorSagas),
    effects.fork(dashboardSagas),
    effects.fork(web3Sagas),
    effects.fork(authSagas),
    effects.fork(lightWalletSagas),
  ]);
}

export function* rootSaga(): Iterator<effects.Effect> {
  while (true) {
    try {
      yield effects.call(allSagas);
    } catch (e) {
      try {
        // @todo add some kind of bugreporting
      } catch (_) {}
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

export function* neuFork(saga: (deps: TGlobalDependencies) => any): Iterator<effects.Effect> {
  const deps: TGlobalDependencies = yield effects.getContext("deps");
  yield fork(saga, deps);
}

export function* neuCall(saga: (deps: TGlobalDependencies) => any): Iterator<effects.Effect> {
  const deps: TGlobalDependencies = yield effects.getContext("deps");
  return yield call(saga, deps);
}

/**
 *
 * Legacy
 *
 */
export function* getDependency(name: symbol): Iterator<effects.Effect> {
  const context: Container = yield effects.getContext("container");
  return context.get(name);
}

export function* callAndInject(func: FunctionWithDeps, ...args: any[]): Iterator<effects.Effect> {
  const container: Container = yield effects.getContext("container");

  const depSymbols = getDependencies(func);

  const deps = depSymbols.map(s => container.get(s));

  return yield (call as any)(func, ...deps, ...args);
}

export function* forkAndInject(func: FunctionWithDeps): any {
  const container: Container = yield effects.getContext("container");

  const depSymbols = getDependencies(func);

  const deps = depSymbols.map(s => container.get(s));

  return yield (fork as any)(func, ...deps);
}
