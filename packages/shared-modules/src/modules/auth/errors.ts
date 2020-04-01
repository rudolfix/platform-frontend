class AuthModuleError extends Error {
  constructor(message: string) {
    super(`AuthModuleError: ${message}`);
  }
}

export { AuthModuleError };
