import { createActionFactory } from "@neufund/shared-utils";

export const qrCodeScannerActions = {
  onScan: createActionFactory("ON_SCAN", (data: string) => ({ data })),
};
