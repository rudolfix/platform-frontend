import { coreModuleApi, ILogger, TLibSymbolType } from "@neufund/shared-modules";
import { assertNever } from "@neufund/shared-utils";
import { inject, injectable } from "inversify";
import { NativeModules } from "react-native";
import { getSupportedBiometryType } from "react-native-keychain";

import { convertBiometrics } from "modules/biometry/lib/utils";
import { EBiometryType, BIOMETRY_NONE } from "modules/biometry/types";
import { permissionsModuleApi, PERMISSIONS, PERMISSION_RESULTS } from "modules/permissions/module";

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

  async hasBiometricsPermissions(): Promise<boolean> {
    const supportedBiometrics = await this.getSupportedBiometrics();

    switch (supportedBiometrics) {
      case EBiometryType.IOSFaceID: {
        const permission = await this.permissions.check(PERMISSIONS.IOS.FACE_ID);

        // when permission result is blocked
        // then access was denied by user for the app
        return permission !== PERMISSION_RESULTS.BLOCKED;
      }
      case EBiometryType.IOSTouchID:
        return true;
      case BIOMETRY_NONE:
        return false;
      default:
        assertNever(supportedBiometrics);
    }
  }
}
