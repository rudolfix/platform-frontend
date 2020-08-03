import { TModuleState } from "../../types";
import { generateSharedModuleId } from "../../utils";
import { TAuthModuleState } from "../auth/module";
import { kycActions } from "./actions";
import { setupContainerModule } from "./bindings";
import { kycReducerMap } from "./reducer";
import { loadBankAccountDetails, loadKycRequestData, loadKycStatus, setupKycSagas } from "./sagas";
import * as selectors from "./selectors";
import { symbols } from "./symbols";
import * as utils from "./utils";

export { KycFlowMessage, EKycRequestStatusTranslation } from "./messages";
export * from "./lib/http/kyc-api/KycApi.interfaces";
export * from "./types";

const MODULE_ID = generateSharedModuleId("kyc");

type Config = Parameters<typeof setupKycSagas>[0];

const setupKycModule = ({
  displayErrorModalSaga,
  ensurePermissionsArePresentAndRunEffect,
  waitUntilSmartContractsAreInitialized,
}: Config) => {
  const module = {
    id: MODULE_ID,
    api: kycApi,
    libs: [setupContainerModule()],
    sagas: [
      setupKycSagas({
        waitUntilSmartContractsAreInitialized,
        displayErrorModalSaga,
        ensurePermissionsArePresentAndRunEffect,
      }),
    ],
    reducerMap: kycReducerMap,
  };

  return module;
};

const kycApi = {
  actions: kycActions,
  selectors,
  sagas: { loadKycRequestData, loadBankAccountDetails, loadKycStatus },
  utils,
  symbols,
  reducerMap: kycReducerMap,
};

export { setupKycModule, kycApi };

export type TPureKycModuleState = TModuleState<typeof setupKycModule>;
export type TKycModuleState = TPureKycModuleState & TAuthModuleState;
