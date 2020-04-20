import { AppError } from "../../classes/AppError";

class NotificationsModuleErrror extends AppError {
  constructor(message: string) {
    super(`EthModuleError: ${message}`);
  }
}

export { NotificationsModuleErrror };
