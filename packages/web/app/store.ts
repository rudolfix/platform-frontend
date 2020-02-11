import { createStore, getSagaExtension, IExtension } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared";
import {
  INeuModule,
  setupCoreModule,
  TModuleActions,
  TModuleSetup,
  TModuleState,
} from "@neufund/shared-modules";
import {
  connectRouter,
  LocationChangeAction,
  routerMiddleware,
  RouterState,
} from "connected-react-router";
import { History } from "history";
import { Container } from "inversify";
import { connect, InferableComponentEnhancerWithProps, Options } from "react-redux";
import { Reducer, ReducersMapObject } from "redux";
import { composeWithDevTools } from "redux-devtools-extension";

import { IConfig } from "./config/getConfig";
import { createGlobalDependencies, setupBindings, TGlobalDependencies } from "./di/setupBindings";
import { reduxLogger } from "./middlewares/redux-logger";
import { reduxLogoutReset } from "./middlewares/redux-logout-reset";
import { TAction } from "./modules/actions";
import { initInitialState } from "./modules/init/reducer";
import { appReducers } from "./modules/reducer";
import { rootSaga } from "./modules/sagas";

export type AppGlobalDispatch = (a: AppActionTypes) => void;

export type AppReducer<S> = Reducer<DeepReadonly<S>, AppActionTypes>;

// add new external actions here
export type AppActionTypes = DeepReadonly<TAction | LocationChangeAction>;

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

export function getContextExtension(context: {
  container: Container;
  deps?: TGlobalDependencies;
}): IExtension {
  return {
    onModuleAdded: (module: INeuModule<unknown>) => {
      if (module.libs) {
        context.container.load(...module.libs);
      }

      // TODO: Replace by generating dependencies per each module separately
      //       after full migration to modular approach
      if (module.id === "root") {
        // we have to create the dependencies here, because getState and dispatch get
        // injected in the middleware step above, maybe change this later
        context.deps = createGlobalDependencies(context.container);
      }
    },

    onModuleRemoved: (module: INeuModule<unknown>) => {
      if (module.libs) {
        context.container.unload(...module.libs);
      }
    },
  };
}

export const createAppStore = (history: History, config: IConfig, container: Container) => {
  const reducerMap = generateRootModuleReducerMap(history);

  const rootModule: INeuModule<TAppGlobalState> = {
    id: "root",
    reducerMap,
    sagas: [rootSaga],
    libs: [setupBindings(config)],
    middlewares: [routerMiddleware(history), reduxLogger(container)],
  };

  const context: { container: Container; deps?: TGlobalDependencies } = {
    container,
  };

  return createStore(
    {
      extensions: [getContextExtension(context), getSagaExtension(context)],
      enhancers: [reduxLogoutReset(staticValues)],
      advancedComposeEnhancers: composeWithDevTools({
        actionsBlacklist: (process.env.REDUX_DEVTOOLS_ACTION_BLACK_LIST || "").split(","),
      }),
    },
    setupCoreModule({ backendRootUrl: config.backendRoot.url }),
    rootModule,
  );
};

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

/**
 * If react-redux connection function receive `undefined` as a `dispatchToProps` method it then pass `dispatch` method to wrapped component.
 * Often it's not needed as it leads to problems when wrapped component spread all props to any dom element
 * @param omitDispatch
 */
const getDispatchToProps = (omitDispatch: boolean) => (omitDispatch ? () => ({}) : undefined);

type TCustomOptions = {
  omitDispatch?: boolean;
};

type TModuleStateOrNever<T extends TModuleSetup<any, any> | never> = T extends TModuleSetup<
  any,
  any
>
  ? TModuleState<T>
  : never;

type TModuleActionsOrNever<
  Module extends TModuleSetup<any, any> | never
> = Module extends TModuleSetup<any, any> ? TModuleActions<Module> : never;

interface IAppConnectOptions<S, D, O, Module extends TModuleSetup<any, any> | never> {
  stateToProps?: (state: TAppGlobalState | TModuleStateOrNever<Module>, ownProps: O) => S;
  dispatchToProps?: (
    dispatch: (a: AppActionTypes | TModuleActionsOrNever<Module>) => void,
    ownProps: O,
  ) => D;
  options?: Options<TAppGlobalState, S, O> & TCustomOptions;
}

// helper to use instead of redux connect. It's bound with our app state and it uses dictionary to pass arguments
export function appConnect<
  S = {},
  D = {},
  P = {},
  Module extends TModuleSetup<any, any> | never = never
>({
  stateToProps,
  dispatchToProps,
  options = {},
}: IAppConnectOptions<S, D, P, Module>): InferableComponentEnhancerWithProps<S & D, P> {
  const { omitDispatch = false, ...connectOptions } = options;

  return connect<S, D, P, TAppGlobalState | TModuleState<Module>>(
    stateToProps,
    dispatchToProps || (getDispatchToProps(omitDispatch) as any),
    undefined,
    connectOptions,
  );
}
