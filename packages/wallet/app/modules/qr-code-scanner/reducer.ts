import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { qrCodeScannerActions } from "modules/qr-code-scanner/actions";

type TQRCodeScannerState = {
  ready: boolean;
};

const initialState: TQRCodeScannerState = {
  ready: true,
};

const qrCodeScannerReducer: AppReducer<TQRCodeScannerState, typeof qrCodeScannerActions> = (
  state = initialState,
  action,
): DeepReadonly<TQRCodeScannerState> => {
  switch (action.type) {
    case qrCodeScannerActions.onScan.getType():
      return {
        ...state,
        ready: false,
      };

    case qrCodeScannerActions.onScanDone.getType():
      return {
        ...state,
        ready: true,
      };

    default:
      return state;
  }
};

const qrCodeScannerReducerMap = {
  qrCodeScanner: qrCodeScannerReducer,
};

export { qrCodeScannerReducerMap };
