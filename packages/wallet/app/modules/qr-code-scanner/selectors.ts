import { StateFromReducersMapObject } from "redux";

import { qrCodeScannerReducerMap } from "modules/qr-code-scanner/reducer";

type QRCodeScannerState = StateFromReducersMapObject<typeof qrCodeScannerReducerMap>;

const selectQRCodeScannerState = (state: QRCodeScannerState) => state.qrCodeScanner;

const selectQRCodeScannerReady = (state: QRCodeScannerState) =>
  selectQRCodeScannerState(state).ready;

export { selectQRCodeScannerReady };
