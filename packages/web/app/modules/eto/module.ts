import { etoModuleApi, setupEtoModule } from "@neufund/shared-modules";

import { setupEtoSagas } from "./sagas";

const MODULE_ID = "web:eto";

const setupWebEtoModule = () => {
  const parentModule = setupEtoModule();

  const webEtoModule = {
    id: MODULE_ID,
    api: etoModuleApi,
    sagas: [setupEtoSagas()],
    reducerMap: parentModule.reducerMap,
  };

  return [parentModule, webEtoModule];
};

export { setupWebEtoModule, etoModuleApi };
