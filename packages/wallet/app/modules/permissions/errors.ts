import { AppError } from "../../classes/AppError";

class PermissionsModuleError extends AppError {
  constructor(message: string) {
    super(`EthModuleError: ${message}`);
  }
}

export { PermissionsModuleError };
