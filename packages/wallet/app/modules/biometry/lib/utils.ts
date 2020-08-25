import { assertNever } from "@neufund/shared-utils";
import { BIOMETRY_TYPE } from "react-native-keychain";

import { BIOMETRY_NONE, EBiometryType } from "modules/biometry/types";

/**
 * Converts keychain biometry type to the app format
 */
export const convertBiometrics = (biometryType: BIOMETRY_TYPE | null) => {
  switch (biometryType) {
    case BIOMETRY_TYPE.TOUCH_ID:
      return EBiometryType.IOSTouchID;
    case BIOMETRY_TYPE.FACE_ID:
      return EBiometryType.IOSFaceID;

    // TODO: Add android biometry
    case BIOMETRY_TYPE.FINGERPRINT:
    case null:
      return BIOMETRY_NONE;

    default:
      assertNever(biometryType);
  }
};
