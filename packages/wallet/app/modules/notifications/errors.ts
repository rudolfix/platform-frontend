import { AppError } from "../../classes/AppError";

class NotificationsModuleErrror extends AppError {
  constructor(message: string) {
    super(`NotificationsModuleErrror: ${message}`);
  }
}

export { NotificationsModuleErrror };
