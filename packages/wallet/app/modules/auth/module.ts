import { setupAuthModule as setupSharedAuthModule } from "@neufund/shared-modules";
import { walletEthModuleApi } from "../eth/module";
import { authActions } from "./actions";
import { setupBindings } from "./lib/bindings";
import { privateSymbols } from "./lib/symbols";
import { authReducerMap, EAuthState } from "./reducer";
import { authSaga, trySignInExistingAccount } from "./sagas";
import { selectAuthState, selectUser } from "./selectors";

const MODULE_ID = "wallet:auth";

const setupAuthModule = () => {
  const authModule = {
    id: MODULE_ID,
    sagas: [authSaga],
    reducerMap: authReducerMap,
    libs: [setupBindings()],
    api: authModuleAPI,
  };

  return [
    setupSharedAuthModule({
      jwtStorageSymbol: privateSymbols.jwtStorage,
      ethManagerSymbol: walletEthModuleApi.symbols.ethManager,
    }),
    authModule,
  ];
};

const authModuleAPI = {
  actions: authActions,
  selectors: {
    selectAuthState,
    selectUser,
  },
  sagas: {
    trySignInExistingAccount,
  },
};

export { setupAuthModule, authModuleAPI, EAuthState };
