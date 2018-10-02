import { all, cancel, take } from "redux-saga/effects";
import { TGlobalDependencies } from "../di/setupBindings";
import { TActionType } from "./actions";
import { neuFork } from "./sagas";

/**
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeUntil(
  startAction: TActionType | [TActionType],
  stopAction: TActionType | [TActionType],
  saga: (deps: TGlobalDependencies) => any,
): any {
  const startActionArray = Array.isArray(startAction) ? startAction : [startAction];
  const stopActionArray = Array.isArray(stopAction) ? stopAction : [stopAction];

  while (yield all(startActionArray.map((actionType: TActionType) => take(actionType)))) {
    const cancelForkToken = yield neuFork(saga);

    yield all(stopActionArray.map((actionType: TActionType) => take(actionType)));
    yield cancel(cancelForkToken);
  }
}
