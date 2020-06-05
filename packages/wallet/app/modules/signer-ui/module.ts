import { signerUIActions } from "./actions";
import { ESignerUIState, signerUIReducerMap } from "./reducer";
import { signedUISaga } from "./sagas";
import { selectSignerUIRequest, selectSignerUIState } from "./selectors";
import { ESignerType } from "./types";

const MODULE_ID = "wallet:signer-ui";

const setupSignerUIModule = () => ({
  id: MODULE_ID,
  sagas: [signedUISaga],
  reducerMap: signerUIReducerMap,
  api: signerUIModuleApi,
});

const signerUIModuleApi = {
  actions: signerUIActions,
  selectors: {
    selectSignerUIRequest,
    selectSignerUIState,
  },
};

export { setupSignerUIModule, signerUIModuleApi, ESignerUIState, ESignerType };
