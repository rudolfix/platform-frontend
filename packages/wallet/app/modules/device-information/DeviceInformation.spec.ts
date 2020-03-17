import { DeviceInformation } from "./DeviceInformation";

describe("DeviceInformation", () => {
  const deviceId = "111";
  let deviceInformation: DeviceInformation;

  beforeEach(() => {
    deviceInformation = new DeviceInformation();
  });

  it("should return device ID", () => {
    const testDeviceId = deviceInformation.getUniqueId();

    expect(testDeviceId).toBe(deviceId);
  });

  it("should check if simulatorD", async () => {
    const isEmulator = await deviceInformation.isEmulator();
    expect(isEmulator).toBeTruthy();
  });
});
