import { isEqual } from "lodash/fp";
import {
  call,
  Effect,
  getContext,
  race,
  spawn,
  StringableActionCreator,
  take,
  takeEvery,
  takeLatest,
} from "redux-saga/effects";
import { TGlobalDependencies } from "../di/setupBindings";
import { TAction, TActionPayload, TActionType } from "./actions";

export function* neuTakeLatest(
  type: TActionType | TActionType[],
  saga: (deps: TGlobalDependencies, ...args: any[]) => any,
): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  yield takeLatest(type, saga, deps);
}

export function* neuTakeEvery(
  type: TActionType | TActionType[] | StringableActionCreator<TAction>,
  saga: (deps: TGlobalDependencies, ...args: any[]) => any,
): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  yield takeEvery(type, saga, deps);
}

export function* neuFork(
  saga: (deps: TGlobalDependencies, ...args: any[]) => any,
  ...args: any[]
): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  return yield spawn(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}

export function* neuCall(
  saga: (deps: TGlobalDependencies, ...args: any[]) => any,
  ...args: any[]
): Iterator<Effect> {
  const deps: TGlobalDependencies = yield getContext("deps");
  return yield call(saga, deps, args[0], args[1], args[2], args[3], args[4]);
}

/**
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeUntil(
  startAction: TActionType | TActionType[] | StringableActionCreator<TAction>,
  stopAction: TActionType | TActionType[] | StringableActionCreator<TAction>,
  saga: (deps: TGlobalDependencies, ...args: any[]) => any,
): any {
  while (true) {
    const action = yield take(startAction);
    // No direct concurrent requests like `fork` or `spawn` should be in the loop
    yield race({
      task: neuCall(saga, action),
      cancel: take(stopAction),
    });
  }
}

/**
 *  Awaits an Action with specific payload
 */
export function* neuTakeOnly<T extends TActionType>(action: T, payload: TActionPayload<T>): any {
  while (true) {
    const takenAction = yield take(action);
    if (isEqual(takenAction.payload, payload)) return;
  }
}

/**
 *  Executes the generator and repeats if repeatAction was dispatched. Exits when endAction
 *  is dispatched.
 */
export function* neuRepeatIf(
  repeatAction: TActionType | TActionType[],
  endAction: TActionType | TActionType[],
  generator: any,
  extraParam?: any,
): any {
  while (true) {
    yield neuCall(generator, extraParam);

    const { repeat, end } = yield race({
      repeat: take(repeatAction),
      end: take(endAction),
    });
    if (repeat) {
      continue;
    }
    if (end) {
      return;
    }
  }
}
