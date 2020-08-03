import {
  appConnect as sharedAppConnect,
  setupAuthModule,
  setupBookbuildingModule,
  setupContractsModule,
  setupCoreModule,
  setupGasModule,
  setupInvestorPortfolioModule,
  setupKycModule,
  setupTokenPriceModule,
  setupWalletModule,
  TAppConnectOptions,
  TModuleSetup,
  TModuleState,
} from "@neufund/shared-modules";
import { DeepReadonly } from "@neufund/shared-utils";
import {
  connectRouter,
  LocationChangeAction,
  routerMiddleware,
  RouterState,
} from "connected-react-router";
import { History } from "history";
import { Container } from "inversify";
import { InferableComponentEnhancerWithProps } from "react-redux";
import { Reducer } from "redux";

import { IConfig } from "./config/getConfig";
import { setupBindings } from "./di/setupBindings";
import { symbols } from "./di/symbols";
import { reduxLogger } from "./middlewares/redux-logger";
import { actions, TAction } from "./modules/actions";
import { AUTH_JWT_TIMING_THRESHOLD, AUTH_TOKEN_REFRESH_THRESHOLD } from "./modules/auth/constants";
import { ensurePermissionsArePresentAndRunEffect } from "./modules/auth/jwt/sagas";
import { setupWebEtoModule } from "./modules/eto/module";
import { displayErrorModalSaga } from "./modules/generic-modal/sagas";
import { setupGovernanceModule } from "./modules/governance/module";
import { waitUntilSmartContractsAreInitialized } from "./modules/init/sagas";
import { setupInstantIdModule } from "./modules/instant-id/module";
import { setupWebNotificationUIModule } from "./modules/notification-ui/module";
import { appReducers } from "./modules/reducer";
import { rootSaga } from "./modules/sagas";
import { setupShareholderResolutionsVotingViewModule } from "./modules/shareholder-resolutions-voting-view/module";
import { setupWebTxHistoryModule } from "./modules/tx-history/module";
import { IDisconnectedWeb3State, web3InitialState } from "./modules/web3/reducer";

// add new external actions here
export type AppActionTypes = DeepReadonly<TAction | LocationChangeAction>;

export type AppReducer<S> = Reducer<DeepReadonly<S>, AppActionTypes>;

export type AppGlobalDispatch = (a: AppActionTypes) => void;

export const generateRootModuleReducerMap = (history: History) => ({
  ...appReducers,
  router: connectRouter(history) as Reducer<RouterState>,
});

type TAppModuleConfig = {
  history: History;
  config: IConfig;
  container: Container;
};

export const setupAppModule = ({ history, config, container }: TAppModuleConfig) => {
  const reducerMap = generateRootModuleReducerMap(history);

  const appModule = {
    id: "app",
    reducerMap,
    sagas: [rootSaga],
    libs: [setupBindings(config)],
    middlewares: [routerMiddleware(history), reduxLogger(container)],
  };

  const authConfig = {
    backendRootUrl: config.backendRoot.url,
    jwtStorageSymbol: symbols.jwtStorage,
    ethManagerSymbol: symbols.web3Manager,
    jwtTimingThreshold: AUTH_JWT_TIMING_THRESHOLD,
    jwtRefreshThreshold: AUTH_TOKEN_REFRESH_THRESHOLD,
  };

  return [
    setupCoreModule({ backendRootUrl: config.backendRoot.url }),
    ...setupAuthModule(authConfig),
    setupContractsModule({
      contractsServiceSymbol: symbols.contractsService,
    }),
    setupTokenPriceModule({
      refreshOnAction: actions.web3.newBlockArrived,
    }),
    setupWalletModule({ waitUntilSmartContractsAreInitialized }),
    ...setupWebTxHistoryModule({
      refreshOnAction: actions.web3.newBlockArrived,
    }),
    setupInstantIdModule(),
    setupGasModule(),
    setupWebNotificationUIModule(),
    ...setupShareholderResolutionsVotingViewModule(),
    setupGovernanceModule(),
    setupKycModule({
      ensurePermissionsArePresentAndRunEffect,
      displayErrorModalSaga,
      waitUntilSmartContractsAreInitialized,
    }),
    ...setupWebEtoModule(),
    setupBookbuildingModule({
      ensurePermissionsArePresentAndRunEffect,
      refreshOnAction: actions.web3.newBlockArrived,
    }),
    setupInvestorPortfolioModule(),
    appModule,
  ];
};

export type TAppGlobalState = TModuleState<typeof setupAppModule>;

const createInitialWeb3State = (state: TAppGlobalState) => {
  const web3State = { ...web3InitialState };
  if (state.web3 && (state.web3 as IDisconnectedWeb3State).previousConnectedWallet) {
    web3State.previousConnectedWallet = (state.web3 as IDisconnectedWeb3State).previousConnectedWallet;
  }
  return web3State;
};

// All states that should remain even after logout
export const staticValues = (
  state: TAppGlobalState | undefined,
): Partial<TAppGlobalState> | undefined => {
  if (state) {
    return {
      router: state.router,
      contracts: state.contracts,
      walletSelector: state.walletSelector,
      init: state.init,
      web3: createInitialWeb3State(state),
      browser: state.browser,
    };
  }

  return undefined;
};

// helper to use instead of redux connect. It's bound with our app state and it uses dictionary to pass arguments
export function appConnect<
  StateToProps = {},
  DispatchToProps = {},
  Props = {},
  Module extends TModuleSetup<any, any, any> | never = never
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
