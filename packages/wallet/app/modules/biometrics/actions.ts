import { createActionFactory } from "@neufund/shared-utils";

import { EBiometricsType, TBiometricsNone } from "modules/biometrics/types";

export const biometricsActions = {
  noBiometricsSupport: createActionFactory(
    "BIOMETRICS_NO_SUPPORT",
    (type: EBiometricsType | TBiometricsNone) => ({
      type,
    }),
  ),

  noBiometricsAccess: createActionFactory("BIOMETRICS_NO_ACCESS", (type: EBiometricsType) => ({
    type,
  })),

  biometricsAccessRequestRequired: createActionFactory(
    "BIOMETRICS_ACCESS_REQUEST_REQUIRED",
    (type: EBiometricsType) => ({
      type,
    }),
  ),

  biometricsAccessAllowed: createActionFactory(
    "BIOMETRICS_ACCESS_ALLOWED",
    (type: EBiometricsType) => ({
      type,
    }),
  ),

  requestPermissions: createActionFactory("BIOMETRICS_REQUEST_PERMISSION"),
};
