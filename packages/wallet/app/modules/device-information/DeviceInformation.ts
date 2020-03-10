import { getUniqueId, isEmulator } from "react-native-device-info";
import { Platform } from "react-native";
import { injectable } from "inversify";

@injectable()
export class DeviceInformation {
  getUniqueId(): string {
    return getUniqueId();
  }

  async isEmulator(): Promise<boolean> {
    return isEmulator();
  }

  getPlatform(): string {
    return Platform.OS;
  }
}
