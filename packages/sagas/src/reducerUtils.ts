import { DeepReadonly, Values } from "@neufund/shared";
import { ActionCreatorsMapObject, AnyAction, Reducer, ReducersMapObject } from "redux";

export type TReducersMapToState<T extends ReducersMapObject<object>> = T extends ReducersMapObject<
  infer S
>
  ? S
  : never;

export type TReducersMapToActions<
  T extends ReducersMapObject<object>
> = T extends ReducersMapObject<object, infer A> ? A : never;

export type TActionCreatorsMapToActions<AC extends ActionCreatorsMapObject<AnyAction>> = ReturnType<
  Values<AC>
>;

export type AppReducer<S, A extends ActionCreatorsMapObject<AnyAction>> = Reducer<
  DeepReadonly<S>,
  DeepReadonly<TActionCreatorsMapToActions<A> | Exclude<AnyAction, TActionCreatorsMapToActions<A>>>
>;

export type ExtractActionTypeFromCreator<T extends (...args: any[]) => any> = T extends (
  ...args: any[]
) => { type: infer P }
  ? P
  : never;
export type TActionFromCreator<
  A extends ActionCreatorsMapObject,
  T extends (...args: any[]) => any
> = Extract<ReturnType<Values<A>>, { type: ExtractActionTypeFromCreator<T> }>;
