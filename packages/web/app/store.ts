import { createStore, getSagaExtension } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared";
import {
  appConnect as sharedAppConnect,
  getContextToDepsExtension,
  getLoadContextExtension,
  INeuModule,
  setupCoreModule,
  TAppConnectOptions,
  TModuleSetup,
} from "@neufund/shared-modules";
import {
  connectRouter,
  LocationChangeAction,
  routerMiddleware,
  RouterState,
} from "connected-react-router";
import { History } from "history";
import { Container } from "inversify";
import { InferableComponentEnhancerWithProps } from "react-redux";
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

export const createAppStore = (history: History, config: IConfig, container: Container) => {
  const reducerMap = generateRootModuleReducerMap(history);

  const appModule: INeuModule<TAppGlobalState> = {
    id: "app",
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
      extensions: [
        getLoadContextExtension(context.container),
        getContextToDepsExtension(appModule, createGlobalDependencies, context),
        getSagaExtension(context),
      ],
      enhancers: [reduxLogoutReset(staticValues)],
      advancedComposeEnhancers: composeWithDevTools({
        actionsBlacklist: (process.env.REDUX_DEVTOOLS_ACTION_BLACK_LIST || "").split(","),
      }),
    },
    setupCoreModule({ backendRootUrl: config.backendRoot.url }),
    appModule,
  );
};

// All states that should remain even after logout
const staticValues = (state: TAppGlobalState | undefined): Partial<TAppGlobalState> | undefined => {
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
