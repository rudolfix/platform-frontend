import {
  ActionPattern,
  call,
  CallEffect,
  delay,
  fork,
  getContext,
  race,
  SagaGenerator,
  SagaReturnType,
  spawn,
  take,
  takeEvery,
  takeLatest,
  throttle,
} from "@neufund/sagas";
import isMatch from "lodash/fp/isMatch";

import { TGlobalDependencies } from "../di/setupBindings";
import { TActionPayload, TPattern } from "./actions";

type TSagaWithDeps = (deps: TGlobalDependencies, ...args: any[]) => any;
type TSagaWithDepsAndArgs<R, T extends any[]> = (deps: TGlobalDependencies, ...args: T) => R;

export function* neuGetContext(): Generator<any, TGlobalDependencies, any> {
  const deps: unknown = yield getContext("deps");
  return deps as TGlobalDependencies;
}

export function* neuTakeLatest(type: ActionPattern, saga: TSagaWithDeps): Generator<any, any, any> {
  const deps = yield* neuGetContext();
  yield takeLatest(type, saga, deps);
}

export function* neuTakeEvery(type: ActionPattern, saga: TSagaWithDeps): Generator<any, any, any> {
  const deps = yield* neuGetContext();
  yield takeEvery(type, saga, deps);
}

export function* neuFork<R, T extends any[]>(
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): Generator<any, any, any> {
  const deps = yield* neuGetContext();
  return yield (fork as any)(saga, deps, ...args);
}

export function* neuSpawn<R, T extends any[]>(
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): Generator<any, any, any> {
  const deps = yield* neuGetContext();
  return yield (spawn as any)(saga, deps, ...args);
}

export function* neuCall<
  Args extends any[],
  FN extends (deps: TGlobalDependencies, ...args: Args) => any
>(fn: FN, ...args: Args): SagaGenerator<SagaReturnType<FN>, CallEffect<SagaReturnType<FN>>> {
  const deps = yield* neuGetContext();

  return yield* call(fn, ...([deps, ...args] as Parameters<typeof fn>));
}

/**
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeUntil(
  startAction: ActionPattern,
  stopAction: ActionPattern,
  saga: TSagaWithDeps,
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
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeLatestUntil(
  startAction: ActionPattern,
  stopAction: ActionPattern,
  saga: TSagaWithDeps,
): any {
  yield takeLatest(startAction, function*(payload): Generator<any, any, any> {
    yield race({
      task: neuCall(saga, payload),
      cancel: take(stopAction),
    });
  });
}

/**
 * Starts saga on `startAction`, cancels on `stopAction`, loops...
 */
export function* neuTakeEveryUntil(
  startAction: ActionPattern,
  stopAction: ActionPattern,
  saga: TSagaWithDeps,
): any {
  yield takeEvery(startAction, function*(payload): Generator<any, any, any> {
    yield race({
      task: neuCall(saga, payload),
      cancel: take(stopAction),
    });
  });
}

/**
 *  Awaits an Action with specific payload.
 *  You can pass only a part of the payload that you want to match.
 */
export function* neuTakeOnly<T extends TPattern>(
  type: T,
  payload: Partial<TActionPayload<T>>,
): any {
  while (true) {
    const takenAction: any = yield take(type);
    if (
      takenAction?.payload === undefined ||
      isMatch(payload as object, takenAction.payload as object)
    ) {
      return takenAction;
    }
  }
}

/**
 *  Executes the generator and repeats if repeatAction was dispatched. Exits when endAction
 *  is dispatched.
 */
export function* neuRepeatIf<R, T extends any[]>(
  repeatAction: ActionPattern,
  endAction: ActionPattern,
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): any {
  while (true) {
    yield neuCall(saga, ...args);

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

/**
 *  Executes the generator and restarts running job if a specific actions is fired
 */
export function* neuRestartIf<R, T extends any[]>(
  cancelAction: ActionPattern,
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): any {
  while (true) {
    yield race({
      task: neuCall(saga, ...args),
      cancel: take(cancelAction),
    });
  }
}

/**
 * Ignore incoming actions for a given period of time while processing a task.
 * After spawning a task, it's still accepting incoming actions into the underlying buffer, keeping at most 1.
 */
export function* neuThrottle(
  ms: number,
  type: ActionPattern,
  saga: TSagaWithDeps,
): Generator<any, any, any> {
  const deps = yield* neuGetContext();
  yield throttle(ms, type, saga, deps);
}

function* next<R, T extends any[]>(
  ms: number,
  task: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): Generator<any, any, any> {
  yield delay(ms);
  yield neuCall(task, ...args);
}

// TODO: Add tests for debounce
export function* neuDebounce<R, T extends any[]>(
  ms: number,
  pattern: ActionPattern,
  saga: TSagaWithDepsAndArgs<R, T>,
  ...args: T
): Generator<any, any, any> {
  yield (takeLatest as any)(pattern, next, ms, saga, ...args);
}
