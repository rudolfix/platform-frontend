import { coreModuleApi, ILogger, TLibSymbolType } from "@neufund/shared-modules";
import { assertNever } from "@neufund/shared-utils";
import { inject, injectable } from "inversify";
import { NativeModules } from "react-native";
import { getSupportedBiometryType } from "react-native-keychain";

import { convertBiometrics } from "modules/biometry/lib/utils";
import { EBiometryType, BIOMETRY_NONE } from "modules/biometry/types";
import {
  permissionsModuleApi,
  PERMISSIONS,
  PermissionStatus,
  PERMISSION_RESULTS,
} from "modules/permissions/module";

type TRNBiometrics = {
  isSensorAvailable: () => Promise<
    { available: true; biometryType: EBiometryType } | { available: false; error: Error }
  >;
};

// eslint-disable-next-line @typescript-eslint/no-unsafe-assignment
const RNBiometrics: TRNBiometrics = NativeModules.RNBiometrics;

/**
 * @class Permissions
 * Class to manage (request) device permissions e.g. camera, push notifications, location etc.
 * @note to add more permissions follow https://github.com/react-native-community/react-native-permissions
 *
 */
@injectable()
export class Biometry {
  private readonly logger: ILogger;
  private readonly permissions: TLibSymbolType<typeof permissionsModuleApi.symbols.permissions>;

  constructor(
    @inject(coreModuleApi.symbols.logger) logger: ILogger,
    @inject(permissionsModuleApi.symbols.permissions)
    permissions: TLibSymbolType<typeof permissionsModuleApi.symbols.permissions>,
  ) {
    this.logger = logger;
    this.permissions = permissions;
  }

  async getSupportedBiometrics(): Promise<EBiometryType | typeof BIOMETRY_NONE> {
    const sensor = await RNBiometrics.isSensorAvailable();

    if (sensor.available) {
      this.logger.info(`Available biometrics ${sensor.biometryType.toString()}`);

      return sensor.biometryType;
    }

    this.logger.info("No biometrics available");

    return BIOMETRY_NONE;
  }

  async getAvailableBiometrics(): Promise<EBiometryType | typeof BIOMETRY_NONE> {
    const keychainBiometryType = await getSupportedBiometryType();
    const biometryType = convertBiometrics(keychainBiometryType);

    this.logger.info(`Supported biometry type is "${biometryType}"`);

    return biometryType;
  }

  async getBiometryPermission(): Promise<PermissionStatus> {
    const availableBiometrics = await this.getAvailableBiometrics();

    switch (availableBiometrics) {
      case EBiometryType.IOSFaceID:
        return this.permissions.check(PERMISSIONS.IOS.FACE_ID);
      case EBiometryType.IOSTouchID:
        return PERMISSION_RESULTS.GRANTED;
      case BIOMETRY_NONE:
        return PERMISSION_RESULTS.UNAVAILABLE;
      default:
        assertNever(availableBiometrics);
    }
  }

  async requestBiometryPermission(): Promise<PermissionStatus> {
    const availableBiometrics = await this.getAvailableBiometrics();

    switch (availableBiometrics) {
      case EBiometryType.IOSFaceID:
        return this.permissions.request(PERMISSIONS.IOS.FACE_ID);
      case EBiometryType.IOSTouchID:
        return PERMISSION_RESULTS.GRANTED;
      case BIOMETRY_NONE:
        return PERMISSION_RESULTS.UNAVAILABLE;
      default:
        assertNever(availableBiometrics);
    }
  }
}
