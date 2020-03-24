import { walletConnectActions } from "./actions";
import { setupBindings } from "./lib/bindings";
import { walletConnectReducer } from "./reducer";
import { walletConnectSaga } from "./sagas";
import { selectWalletConnectPeer } from "./selectors";

const MODULE_ID = "wallet:wallet-connect";

const reducerMap = {
  walletConnect: walletConnectReducer,
};
const setupWalletConnectModule = () => ({
  id: MODULE_ID,
  libs: [setupBindings()],
  sagas: [walletConnectSaga],
  reducerMap,
  api: walletConnectModuleApi,
});

const walletConnectModuleApi = {
  actions: walletConnectActions,
  selectors: {
    selectWalletConnectPeer,
  },
};

export { setupWalletConnectModule, walletConnectModuleApi };
