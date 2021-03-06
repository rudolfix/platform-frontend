import { actions } from "./actions";
import { governanceReducerMap } from "./reducer";
import { governanceModuleSagas } from "./sagas";
import * as selectors from "./selectors";

const MODULE_ID = "web:governance";

const governanceModuleApi = {
  actions,
  selectors,
};

const setupGovernanceModule = () => ({
  id: MODULE_ID,
  sagas: [governanceModuleSagas],
  reducerMap: governanceReducerMap,
  api: governanceModuleApi,
});

export { setupGovernanceModule, governanceModuleApi };
