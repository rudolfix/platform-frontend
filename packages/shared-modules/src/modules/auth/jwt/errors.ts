import { AuthModuleError } from "../errors";

export class JwtNotAvailable extends AuthModuleError {
  constructor() {
    super("JWT token not available");
  }
}

export class WalletNotAvailableError extends AuthModuleError {
  constructor() {
    super("Wallet not available");
  }
}
