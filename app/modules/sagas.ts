import { effects } from "redux-saga";
import { TAction } from "./actions";

import { Container } from "inversify";

import { fork } from "redux-saga/effects";
import { getDependencies } from "../middlewares/redux-injectify";
import { FunctionWithDeps } from "../types";
import { dashboardSagas } from "./dashboard/sagas";
import { kycSagas } from "./kyc/sagas";
import { walletSelectorSagas } from "./wallet-selector/sagas";
import { web3Sagas } from "./web3/sagas";
import { init, initSagas } from "./init/sagas";
import { authSagas } from "./auth/sagas";

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
export const neuTake = (type: TAction["type"]): effects.TakeEffect => {
  return effects.take(type);
};

export function* getDependency(name: symbol): Iterator<effects.Effect> {
  const context: Container = yield effects.getContext("container");
  return context.get(name);
}

export function* callAndInject(func: FunctionWithDeps, ...args: any[]): Iterator<effects.Effect> {
  const container: Container = yield effects.getContext("container");

  const depSymbols = getDependencies(func);

  const deps = depSymbols.map(s => container.get(s));

  return yield func(...deps, ...args);
}

export function* forkAndInject(func: FunctionWithDeps): any {
  const container: Container = yield effects.getContext("container");

  const depSymbols = getDependencies(func);

  const deps = depSymbols.map(s => container.get(s));

  return yield (fork as any)(func, ...deps);
}
