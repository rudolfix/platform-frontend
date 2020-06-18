import { CallEffectDescriptor, TakeEffectDescriptor } from "redux-saga/effects";

import { providers } from "./tests";

/*
 * redux-saga-test-plan lacks a built-in option to limit how many times to provide an effect.
 * because of this sagas with loops inside (e.g. "while(true){}") never terminate and CI runs out of memory.
 * here's a recommended workaround using dynamic providers
 * @see https://github.com/jfairbank/redux-saga-test-plan/issues/74#issuecomment-294585811
 *
 * */

//TODO naming (callWithCount,takeWithCount) is up to discussion :))

export type TTakeWithCountOptions = { count: number; actionCreator: Function; actionPayload: any };
export type TCallWithCountOptions = {
  count: number;
  expectedFunction: Function;
  functionReturn: any;
};

export enum ESagaTestDynamicProviderResult {
  ERROR = "sagaTestDynamicProviderResultError",
  RETURN = "sagaTestDynamicProviderResultReturn",
}

type TWithCountOptions = { count: number; expectedEffect: Function; matchedReturn: any };
type TEffectDescriptors = TakeEffectDescriptor | CallEffectDescriptor<any>;

const takeMatcher = (action: TakeEffectDescriptor, actionCreator: Function) =>
  action.pattern === actionCreator;
const callMatcher = (effect: CallEffectDescriptor<any>, expectedFunction: Function) =>
  effect.fn === expectedFunction;

export const withCount = <T>(
  { count, expectedEffect, matchedReturn }: TWithCountOptions,
  matcher: (effect: any, y: Function) => boolean,
) => {
  let loopCount = 0;

  return (effect: TEffectDescriptors, next: Function): providers.EffectProvider<T> => {
    if (matcher(effect, expectedEffect) && loopCount < count) {
      loopCount += 1;
      if (
        matchedReturn.result !== undefined &&
        matchedReturn.result === ESagaTestDynamicProviderResult.ERROR
      ) {
        throw matchedReturn.payload;
      } else if (
        matchedReturn.result !== undefined &&
        matchedReturn.result === ESagaTestDynamicProviderResult.RETURN
      ) {
        return matchedReturn.payload;
      } else {
        return matchedReturn;
      }
    } else {
      return next();
    }
  };
};

export const throwError = (error: Error) => ({
  result: ESagaTestDynamicProviderResult.ERROR,
  payload: error,
});

export const callWithCount = ({ count, expectedFunction, functionReturn }: TCallWithCountOptions) =>
  withCount<CallEffectDescriptor<any>>(
    { count, expectedEffect: expectedFunction, matchedReturn: functionReturn },
    callMatcher,
  );

export const takeWithCount = ({ count, actionCreator, actionPayload }: TTakeWithCountOptions) =>
  withCount<TakeEffectDescriptor>(
    { count, expectedEffect: actionCreator, matchedReturn: actionPayload },
    takeMatcher,
  );
