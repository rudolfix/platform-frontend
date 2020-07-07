import { instantIdActions } from "./actions";
import { setupContainerModule } from "./bindings";
import { instantIdReducerMap } from "./reducer";
import { setupInstantIdSagas } from "./sagas";
import * as selectors from "./selectors";
import { symbols } from "./symbols";

const MODULE_ID = "web:instant-id";

/**
 * TODO: This module depends on the kyc module and this dependency
 * need to be declared here when we know how to do that properly
 */

const setupInstantIdModule = () => {
  const instantIdModule = {
    id: MODULE_ID,
    api: instantIdApi,
    sagas: [setupInstantIdSagas()],
    libs: [setupContainerModule()],
    reducerMap: instantIdReducerMap,
  };

  return instantIdModule;
};

const instantIdApi = {
  actions: instantIdActions,
  selectors,
  symbols,
};

export { setupInstantIdModule, instantIdApi };
