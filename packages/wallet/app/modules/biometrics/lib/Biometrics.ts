import { coreModuleApi, ILogger, TLibSymbolType } from "@neufund/shared-modules";
import { assertNever } from "@neufund/shared-utils";
import { inject, injectable } from "inversify";
import {
  AUTHENTICATION_TYPE,
  canImplyAuthentication,
  getSupportedBiometryType,
} from "react-native-keychain";

import { convertBiometrics } from "modules/biometrics/lib/utils";
import { BIOMETRICS_NONE, EBiometricsType } from "modules/biometrics/types";
import {
  PERMISSION_RESULTS,
  PERMISSIONS,
  permissionsModuleApi,
  PermissionStatus,
} from "modules/permissions/module";

/**
 * Manages devices biometrics access
 */
@injectable()
export class Biometrics {
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

  async getAvailableBiometrics(): Promise<EBiometricsType | typeof BIOMETRICS_NONE> {
    const keychainBiometryType = await getSupportedBiometryType();
    const biometryType = convertBiometrics(keychainBiometryType);

    this.logger.info(`Supported biometrics type is "${biometryType}"`);

    return biometryType;
  }

  async getBiometricsPermission(): Promise<PermissionStatus> {
    const availableBiometrics = await this.getAvailableBiometrics();

    switch (availableBiometrics) {
      case EBiometricsType.IOSFaceID:
        return this.permissions.check(PERMISSIONS.IOS.FACE_ID);
      case EBiometricsType.IOSTouchID:
        return PERMISSION_RESULTS.GRANTED;
      case BIOMETRICS_NONE:
        return PERMISSION_RESULTS.UNAVAILABLE;
      default:
        assertNever(availableBiometrics);
    }
  }

  async requestBiometryPermission(): Promise<PermissionStatus> {
    const availableBiometrics = await this.getAvailableBiometrics();

    switch (availableBiometrics) {
      case EBiometricsType.IOSFaceID:
        return this.permissions.request(PERMISSIONS.IOS.FACE_ID);
      case EBiometricsType.IOSTouchID:
        return PERMISSION_RESULTS.GRANTED;
      case BIOMETRICS_NONE:
        return PERMISSION_RESULTS.UNAVAILABLE;
      default:
        assertNever(availableBiometrics);
    }
  }
}
