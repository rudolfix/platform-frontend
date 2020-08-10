import { createActionFactory } from "@neufund/shared-utils";

import { EQRCodeType } from "modules/qr-code-scanner/constants";

export const qrCodeScannerActions = {
  onScan: createActionFactory(
    "ON_SCAN",
    (data: string, requiredQRCodeType: EQRCodeType | undefined) => ({ data, requiredQRCodeType }),
  ),
};
