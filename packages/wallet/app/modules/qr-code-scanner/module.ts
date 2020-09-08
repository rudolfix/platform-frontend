import { qrCodeScannerActions } from "modules/qr-code-scanner/actions";
import { qrCodeScannerReducerMap } from "modules/qr-code-scanner/reducer";
import { qrCodeScannerSaga } from "modules/qr-code-scanner/sagas";

import * as selectors from "./selectors";

const MODULE_ID = "wallet:qr-scanner";

const setupQRCodeScannerModule = () => ({
  id: MODULE_ID,
  sagas: [qrCodeScannerSaga],
  api: qrCodeScannerModuleApi,
  reducerMap: qrCodeScannerReducerMap,
});

const qrCodeScannerModuleApi = {
  actions: qrCodeScannerActions,
  selectors,
};

export { EQRCodeType } from "./constants";
export { setupQRCodeScannerModule, qrCodeScannerModuleApi };
