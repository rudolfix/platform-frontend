import { EthModuleError } from "modules/eth/errors";

class SecureStorageAccessCancelled extends EthModuleError {
  constructor() {
    super("SecureStorageAccessCancelled: User cancelled access request");
  }
}

class SecureStorageUnknownError extends EthModuleError {
  constructor(message: string) {
    super(`SecureStorageUnknownError: ${message}`);
  }
}

export { SecureStorageAccessCancelled, SecureStorageUnknownError };
