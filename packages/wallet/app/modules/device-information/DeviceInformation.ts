import { getUniqueId, isEmulator } from "react-native-device-info";
import { Platform } from "react-native";
import { injectable } from "inversify";

@injectable()
export class DeviceInformation {

  /**
   * Get unique device ID
   * On Android devices that have multiple users, each user appears as a completely separate device, so the ANDROID_ID value is unique to each user.
   * On iOS it uses the DeviceUID uid identifier.
   * iOS: "FCDBD8EF-62FC-4ECB-B2F5-92C9E79AC7F9"
   * Android: "dd96dec43fb81c97"
   * @returns {string} Unique device identifier
   */
  getUniqueId(): string {
    return getUniqueId();
  }

  /**
   * Checks if app is running on emulator
   * @returns {Promise<boolean>} if emulator
   */
  async isEmulator(): Promise<boolean> {
    return isEmulator();
  }

  /**
   * Returns device platform
   * @returns {string} ios or android
   */
  getPlatform(): string {
    return Platform.OS;
  }
}
