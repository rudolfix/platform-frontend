import { assertNever } from "@neufund/shared-utils";
import { BIOMETRY_TYPE } from "react-native-keychain";

import { BIOMETRICS_NONE, EBiometricsType } from "modules/biometrics/types";

/**
 * Converts keychain biometrics type to the app format
 */
export const convertBiometrics = (biometryType: BIOMETRY_TYPE | null) => {
  switch (biometryType) {
    case BIOMETRY_TYPE.TOUCH_ID:
      return EBiometricsType.IOSTouchID;
    case BIOMETRY_TYPE.FACE_ID:
      return EBiometricsType.IOSFaceID;

    // TODO: Add android biometrics
    case BIOMETRY_TYPE.FINGERPRINT:
    case null:
      return BIOMETRICS_NONE;

    default:
      assertNever(biometryType);
  }
};
