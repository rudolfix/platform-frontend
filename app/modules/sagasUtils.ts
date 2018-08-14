import { cancel, take } from "../../node_modules/redux-saga/effects";
import { TGlobalDependencies } from "../di/setupBindings";
import { TActionType } from "./actions";
import { neuFork } from "./sagas";

/**
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeUntil(
  startAction: TActionType,
  stopAction: TActionType,
  saga: (deps: TGlobalDependencies) => any,
): any {
  while (yield take(startAction)) {
    const cancelForkToken = yield neuFork(saga);

    yield take(stopAction);
    yield cancel(cancelForkToken);
  }
}
