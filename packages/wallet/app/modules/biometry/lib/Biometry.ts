import { coreModuleApi, ILogger, TLibSymbolType } from "@neufund/shared-modules";
import { assertNever } from "@neufund/shared-utils";
import { inject, injectable } from "inversify";
import {
  AUTHENTICATION_TYPE,
  canImplyAuthentication,
  getSupportedBiometryType,
} from "react-native-keychain";

import { convertBiometrics } from "modules/biometry/lib/utils";
import { BIOMETRY_NONE, EBiometryType } from "modules/biometry/types";
import {
  PERMISSION_RESULTS,
  PERMISSIONS,
  permissionsModuleApi,
  PermissionStatus,
} from "modules/permissions/module";

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

  async canImplyAuthentication(): Promise<boolean> {
    const canImplyAuth = await canImplyAuthentication({
      authenticationType: AUTHENTICATION_TYPE.BIOMETRICS,
    });

    this.logger.info(
      `Biometrics authentication is "${canImplyAuth ? "supported" : "not supported"}"`,
    );

    return canImplyAuth;
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
