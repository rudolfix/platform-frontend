import { ILogger, TUser } from "./ILogger";

export class DevConsoleLogger implements ILogger {
  setUser(user: TUser | null): void {
    if (user) {
      this.info(`Logged in as ${user.type}`);
    } else {
      this.info("Logged out");
    }
  }

  info(message: string, data?: object): void {
    // tslint:disable-next-line
    console.info(message, data);
  }

  debug(message: string, data?: object): void {
    // tslint:disable-next-line
    console.info(message, data);
  }

  warn(message: string, data?: object): void {
    // tslint:disable-next-line
    console.error(message, data);
  }

  error(error: Error, message?: string, data?: object): void {
    // tslint:disable-next-line
    console.error(message, error, data);
  }

  fatal(error: Error, message?: string, data?: object): void {
    // tslint:disable-next-line
    console.error(message, error, data);
  }
}
