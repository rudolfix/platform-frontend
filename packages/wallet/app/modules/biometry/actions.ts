import { createActionFactory } from "@neufund/shared-utils";

import { EBiometryType, TBiometryNone } from "modules/biometry/types";

export const biometricsActions = {
  noBiometricsSupport: createActionFactory(
    "BIOMETRICS_NO_SUPPORT",
    (type: EBiometryType | TBiometryNone) => ({
      type,
    }),
  ),

  noBiometricsAccess: createActionFactory("BIOMETRICS_NO_ACCESS", (type: EBiometryType) => ({
    type,
  })),

  biometricsAccessRequestRequired: createActionFactory(
    "BIOMETRICS_ACCESS_REQUEST_REQUIRED",
    (type: EBiometryType) => ({
      type,
    }),
  ),

  biometricsAccessAllowed: createActionFactory(
    "BIOMETRICS_ACCESS_ALLOWED",
    (type: EBiometryType) => ({
      type,
    }),
  ),

  requestFaceIdPermissions: createActionFactory("BIOMETRICS_REQUEST_FACE_ID_PERMISSION"),

  // TODO: Find why typings are broken
  test: createActionFactory("TEST"),
};
