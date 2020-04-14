import { generateSharedModuleId } from "../../utils";
import { jwtActions } from "./jwt/actions";
import { jwtReducerMap } from "./jwt/reducer";
import { createJwt, escalateJwt, loadJwt, refreshJWT, setJwt } from "./jwt/sagas";
import * as jwtSelectors from "./jwt/selectors";
import { EJwtPermissions } from "./jwt/types";
import { setupContainerModule } from "./lib/bindings";
import { symbols } from "./lib/symbols";

const MODULE_ID = generateSharedModuleId("auth");

type TModuleConfig = Parameters<typeof setupContainerModule>[0];

const reducerMap = {
  ...jwtReducerMap,
};

const setupAuthModule = (config: TModuleConfig) => ({
  id: MODULE_ID,
  libs: [setupContainerModule(config)],
  reducerMap,
  api: authModuleAPI,
});

const authModuleAPI = {
  actions: {
    ...jwtActions,
  },
  symbols,
  selectors: {
    ...jwtSelectors,
  },
  sagas: {
    loadJwt,
    createJwt,
    setJwt,
    escalateJwt,
    refreshJWT,
  },
};

export { setupAuthModule, authModuleAPI, EJwtPermissions };
