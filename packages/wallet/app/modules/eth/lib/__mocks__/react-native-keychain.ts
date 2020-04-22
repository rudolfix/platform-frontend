import { Dictionary } from "@neufund/shared-utils";

const store: Dictionary<any> = {};

const ACCESS_CONTROL = {
  USER_PRESENCE: "USER_PRESENCE",
};

const ACCESSIBLE = {
  WHEN_PASSCODE_SET_THIS_DEVICE_ONLY: "WHEN_PASSCODE_SET_THIS_DEVICE_ONLY",
};

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
  delete store[server];
  return Promise.resolve(null);
}

async function getInternetCredentials(server: string) {
  const result = store[server] ? store[server] : null;
  return Promise.resolve(result);
}

export {
  ACCESS_CONTROL,
  ACCESSIBLE,
  SECURITY_LEVEL,
  setInternetCredentials,
  resetInternetCredentials,
  getInternetCredentials,
};
