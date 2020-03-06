class AppError extends Error {
  constructor(message: string) {
    super(`Wallet: ${message}`);
  }
}
export { AppError };
