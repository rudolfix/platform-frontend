import { WalletConnectModuleError } from "modules/wallet-connect/errors";

class WalletConnectAdapterError extends WalletConnectModuleError {
  constructor(message: string) {
    super(`WalletConnectAdapter: ${message}`);
  }
}

class InvalidRPCMethodError extends WalletConnectAdapterError {
  constructor(method: string) {
    super(`Invalid RPC method received (${method})`);
  }
}

class NoPeerMetaError extends WalletConnectAdapterError {
  constructor() {
    super("No peer meta provided");
  }
}

class InvalidJSONRPCPayloadError extends WalletConnectAdapterError {
  constructor(method: string, public reason?: Error) {
    super(`Invalid json rpc payload received for ${method}${reason ? ": " + reason.message : ``}`);
  }
}

class UserRejectedRequestError extends WalletConnectAdapterError {
  constructor() {
    super(`User rejected request`);
  }
}

class TooManyPermissionsError extends WalletConnectAdapterError {
  constructor() {
    super(`Too many permissions`);
  }
}

export {
  InvalidJSONRPCPayloadError,
  InvalidRPCMethodError,
  NoPeerMetaError,
  WalletConnectAdapterError,
  UserRejectedRequestError,
  TooManyPermissionsError,
};
