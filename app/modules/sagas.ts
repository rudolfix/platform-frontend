import { effects } from "redux-saga";
import { TAction } from "./actions";

import { Container } from "inversify";

import { getDependencies } from "../middlewares/redux-injectify";
import { FunctionWithDeps } from "../types";
import { authSagas } from "./auth/sagas";
import { dashboardSagas } from "./dashboard/sagas";
import { kycSagas } from "./kyc/sagas";
import { walletSelectorSagas } from "./wallet-selector/sagas";

/**
 * Restart all sagas on error and report error to sentry
 */
function* allSagas(): Iterator<effects.Effect> {
  yield effects.all([
    effects.fork(kycSagas),
    effects.fork(authSagas),
    effects.fork(walletSelectorSagas),
    effects.fork(dashboardSagas),
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

export function* callAndInject(func: FunctionWithDeps): Iterator<effects.Effect> {
  const container: Container = yield effects.getContext("container");

  const depSymbols = getDependencies(func);

  const deps = depSymbols.map(s => container.get(s));

  return yield func(...deps);
}
