import { setupAuthModule as setupSharedAuthModule } from "@neufund/shared-modules";

import { walletEthModuleApi } from "modules/eth/module";

import { authActions } from "./actions";
import { AUTH_JWT_TIMING_THRESHOLD, AUTH_TOKEN_REFRESH_THRESHOLD } from "./constants";
import { setupBindings } from "./lib/bindings";
import { privateSymbols } from "./lib/symbols";
import { authReducerMap, EAuthState } from "./reducer";
import { authSaga, trySignInExistingAccount } from "./sagas";
import { selectAuthState, selectAuthWallet, selectUser } from "./selectors";
import type { TAuthWalletMetadata } from "./types";

const MODULE_ID = "wallet:auth";

const setupAuthModule = (backendRootUrl: string) => {
  const authModule = {
    id: MODULE_ID,
    sagas: [authSaga],
    reducerMap: authReducerMap,
    libs: [setupBindings()],
    api: authModuleAPI,
  };

  return [
    ...setupSharedAuthModule({
      backendRootUrl,
      jwtStorageSymbol: privateSymbols.jwtStorage,
      ethManagerSymbol: walletEthModuleApi.symbols.ethManager,
      jwtTimingThreshold: AUTH_JWT_TIMING_THRESHOLD,
      jwtRefreshThreshold: AUTH_TOKEN_REFRESH_THRESHOLD,
    }),
    authModule,
  ];
};

const authModuleAPI = {
  actions: authActions,
  selectors: {
    selectAuthState,
    selectAuthWallet,
    selectUser,
  },
  sagas: {
    trySignInExistingAccount,
  },
};

export type { TAuthWalletMetadata };
export { setupAuthModule, authModuleAPI, EAuthState };
