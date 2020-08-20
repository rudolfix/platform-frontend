import { walletConnectActions } from "./actions";
import { setupBindings } from "./lib/bindings";
import { isValidWalletConnectUri } from "./lib/utils";
import { walletConnectReducerMap } from "./reducer";
import { tryToConnectExistingSession } from "./sagaFunctions/tryToConnectExistingSession";
import { walletConnectSaga } from "./sagas";
import { selectWalletConnectPeer } from "./selectors";

const MODULE_ID = "wallet:wallet-connect";

const setupWalletConnectModule = () => ({
  id: MODULE_ID,
  libs: [setupBindings()],
  sagas: [walletConnectSaga],
  reducerMap: walletConnectReducerMap,
  api: walletConnectModuleApi,
});

const walletConnectModuleApi = {
  actions: walletConnectActions,
  selectors: {
    selectWalletConnectPeer,
  },
  sagas: {
    tryToConnectExistingSession,
  },
  utils: {
    isValidWalletConnectUri,
  },
};

export { setupWalletConnectModule, walletConnectModuleApi };
