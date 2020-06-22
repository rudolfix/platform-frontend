export type TUser = { id: string; type: string; walletType: string };
export type LogArg = [string, object?];
export type ErrorArgs = [Error, string?, object?];

export interface ILogger {
  info(message: string, data?: object): void;
  debug(message: string, data?: object): void;
  warn(message: string, data?: object): void;
  error(error: Error, message?: string, data?: object): void;
  fatal(error: Error, message?: string, data?: object): void;
  setUser(user: TUser | null): void;
}

export type TLogLevels = Exclude<keyof ILogger, "setUser">;
