import { Dictionary } from "@neufund/shared-utils";

type TCredentials = { password: string; name: string };

const store: Dictionary<TCredentials> = {};

const ACCESS_CONTROL = {
  BIOMETRY_CURRENT_SET: "BIOMETRY_CURRENT_SET",
  DEVICE_PASSCODE: "DEVICE_PASSCODE",
};

const ACCESSIBLE = {
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: "WHEN_PASSCODE_SET_THIS_DEVICE_ONLY",
};

enum AUTHENTICATION_TYPE {
  DEVICE_PASSCODE_OR_BIOMETRICS = "AuthenticationWithBiometricsDevicePasscode",
  BIOMETRICS = "AuthenticationWithBiometrics",
}

const SECURITY_LEVEL = {
  SECURE_HARDWARE: "SECURE_HARDWARE",
};

async function setInternetCredentials(server: string, name: string, password: string) {
  store[server] = {
    name,
    password,
  };
  return Promise.resolve(null);
}

async function resetInternetCredentials(server: string) {
  // eslint-disable-next-line @typescript-eslint/no-dynamic-delete
  delete store[server];
  return Promise.resolve(null);
}

async function getInternetCredentials(server: string): Promise<TCredentials | null> {
  const result = store[server] ? store[server] : null;
  return Promise.resolve(result);
}

async function hasInternetCredentials(server: string) {
  return Promise.resolve(!!store[server]);
}

export {
  AUTHENTICATION_TYPE,
  ACCESS_CONTROL,
  ACCESSIBLE,
  SECURITY_LEVEL,
  setInternetCredentials,
  resetInternetCredentials,
  getInternetCredentials,
  hasInternetCredentials,
};
