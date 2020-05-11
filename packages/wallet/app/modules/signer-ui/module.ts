import { signerUIActions } from "./actions";
import { signerUIReducer, ESignerUIState } from "./reducer";
import { signedUISaga } from "./sagas";
import { selectSignerUIData, selectSignerUIState } from "./selectors";

const MODULE_ID = "wallet:signer-ui";

const setupSignerUIModule = () => ({
  id: MODULE_ID,
  sagas: [signedUISaga],
  reducerMap: {
    signerUI: signerUIReducer,
  },
  api: signerUIModuleApi,
});

const signerUIModuleApi = {
  actions: signerUIActions,
  selectors: {
    selectSignerUIData,
    selectSignerUIState,
  },
};

export { setupSignerUIModule, signerUIModuleApi, ESignerUIState };
