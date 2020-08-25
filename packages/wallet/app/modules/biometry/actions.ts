import { createActionFactory } from "@neufund/shared-utils";

import { EBiometryType, TBiometryNone } from "modules/biometry/types";

export const biometricsActions = {
  noBiometricsSupport: createActionFactory(
    "NO_BIOMETRICS_SUPPORT",
    (type: EBiometryType | TBiometryNone) => ({
      type,
    }),
  ),

  noBiometricsAccess: createActionFactory("NO_BIOMETRICS_ACCESS", (type: EBiometryType) => ({
    type,
  })),

  biometricsAccessAllowed: createActionFactory(
    "BIOMETRICS_ACCESS_ALLOWED",
    (type: EBiometryType) => ({
      type,
    }),
  ),

  // TODO: Find why typings are broken
  test: createActionFactory("TEST"),
};
