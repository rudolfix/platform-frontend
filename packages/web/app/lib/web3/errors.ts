
class WalletError extends Error {
  constructor(message: string) {
    super(`WalletError: ${message}`);
  }
}

export { WalletError };
