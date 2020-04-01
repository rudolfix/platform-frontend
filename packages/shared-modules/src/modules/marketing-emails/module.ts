import { generateSharedModuleId } from "../../utils";
import { actions } from "./actions";
import { setupContainerModule } from "./lib/bindings";
import { symbols } from "./lib/symbols";
import { setupMarketingEmailsSagas } from "./sagas";
import * as selectors from "./selectors";
import * as utils from "./utils";

const MODULE_ID = generateSharedModuleId("marketing-emails");

const setupMarketingEmailsModule = () => ({
  id: MODULE_ID,
  sagas: [setupMarketingEmailsSagas()],
  libs: [setupContainerModule()],
  api: marketingEmailsModuleApi,
});

const marketingEmailsModuleApi = {
  actions,
  symbols,
  selectors,
  utils,
};

export { setupMarketingEmailsModule, marketingEmailsModuleApi };
