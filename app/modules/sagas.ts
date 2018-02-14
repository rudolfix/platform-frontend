import { effects } from "redux-saga";
import { TAction } from "./actions";

import { Container } from "inversify";

import { kycSagas } from "./kyc/sagas";
import { routingSagas } from "./routing/sagas";

/**
 * Restart all sagas on error and report error to sentry
 */
function* allSagas(): Iterator<effects.Effect> {
  yield effects.all([effects.fork(routingSagas), effects.fork(kycSagas)]);
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

export function* getDependency(name: string): Iterator<effects.Effect> {
  const context: Container = yield effects.getContext("container");
  return context.get(name);
}
