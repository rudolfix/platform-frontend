import { DeepReadonly } from "@neufund/shared";
import {
  appConnect as sharedAppConnect,
  TAppConnectOptions,
  TModuleSetup,
} from "@neufund/shared-modules";
import { connectRouter, LocationChangeAction, RouterState } from "connected-react-router";
import { History } from "history";
import { InferableComponentEnhancerWithProps } from "react-redux";
import { Reducer, ReducersMapObject } from "redux";

import { TAction } from "./modules/actions";
import { initInitialState } from "./modules/init/reducer";
import { appReducers } from "./modules/reducer";

// add new external actions here
export type AppActionTypes = DeepReadonly<TAction | LocationChangeAction>;

export type AppReducer<S> = Reducer<DeepReadonly<S>, AppActionTypes>;

export type AppGlobalDispatch = (a: AppActionTypes) => void;

// base on reducers we can infer type of app state
type TReducersMapToReturnTypes<T extends ReducersMapObject<any, any>> = T extends ReducersMapObject<
  infer S,
  any
>
  ? S
  : never;

export const generateRootModuleReducerMap = (history: History) => ({
  ...appReducers,
  router: connectRouter(history) as Reducer<RouterState>,
});

export type TAppGlobalState = TReducersMapToReturnTypes<
  ReturnType<typeof generateRootModuleReducerMap>
>;

// All states that should remain even after logout
export const staticValues = (
  state: TAppGlobalState | undefined,
): Partial<TAppGlobalState> | undefined => {
  if (state) {
    return {
      router: state.router,
      // TODO: Think about the state and where smart contracts should be
      contracts: state.contracts,
      init: { ...initInitialState, smartcontractsInit: state.init.smartcontractsInit },
    };
  }

  return undefined;
};

// helper to use instead of redux connect. It's bound with our app state and it uses dictionary to pass arguments
export function appConnect<
  StateToProps = {},
  DispatchToProps = {},
  Props = {},
  Module extends TModuleSetup<any, any> | never = never
>(
  options: TAppConnectOptions<
    StateToProps,
    DispatchToProps,
    Props,
    AppActionTypes,
    TAppGlobalState,
    Module
  >,
): InferableComponentEnhancerWithProps<StateToProps & DispatchToProps, Props> {
  return sharedAppConnect(options);
}
