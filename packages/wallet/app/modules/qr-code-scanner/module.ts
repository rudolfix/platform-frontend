import { qrCodeScannerActions } from "modules/qr-code-scanner/actions";
import { qrCodeScannerSaga } from "modules/qr-code-scanner/sagas";

const MODULE_ID = "wallet:qr-scanner";

const setupQRCodeScannerModule = () => ({
  id: MODULE_ID,
  sagas: [qrCodeScannerSaga],
  api: qrCodeScannerModuleApi,
});

const qrCodeScannerModuleApi = {
  actions: qrCodeScannerActions,
};

export { setupQRCodeScannerModule, qrCodeScannerModuleApi };
