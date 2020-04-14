class ContractsModuleError extends Error {
  constructor(message: string) {
    super(`ContractsModuleError: ${message}`);
  }
}

export { ContractsModuleError };
