import { DeepReadonly, Values } from "@neufund/shared";
import { ActionCreatorsMapObject, Reducer, ReducersMapObject } from "redux";

import { appReducers } from "../modules/reducers";

type TReducersMapToState<T extends ReducersMapObject<object>> = T extends ReducersMapObject<infer S>
  ? S
  : never;

type TReducersMapToActions<T extends ReducersMapObject<object>> = T extends ReducersMapObject<
  object,
  infer A
>
  ? A
  : never;

export type AppReducer<S, A extends ActionCreatorsMapObject> = Reducer<
  DeepReadonly<S>,
  ReturnType<Values<A>>
>;

export type TAppGlobalState = TReducersMapToState<typeof appReducers>;
export type TAppGlobalActions = TReducersMapToActions<typeof appReducers>;
