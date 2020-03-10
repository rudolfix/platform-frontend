import { getUniqueId, isEmulator } from 'react-native-device-info';
import { injectable } from "inversify";

@injectable()
export class DeviceInformation {
  getUniqueId(): string {
    return getUniqueId();
  }

  async isEmulator(): Promise<boolean> {
    return isEmulator();
  }
}
