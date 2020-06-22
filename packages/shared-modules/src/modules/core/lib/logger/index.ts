import { injectable } from "inversify";

import { DevConsoleLogger } from "./DevConsoleLogger";
import { ErrorArgs, ILogger, LogArg, TUser } from "./ILogger";
import { SentryLogger } from "./SentryLogger";
import { isLevelAllowed } from "./utils";

const noopLogger: ILogger = {
  setUser: () => {},
  info: () => {},
  debug: () => {},
  warn: () => {},
  error: () => {},
  fatal: () => {},
};

const resolveLogger = () => {
  if (process.env.NF_SENTRY_DSN) {
    return new SentryLogger(process.env.NF_SENTRY_DSN);
  }

  if (
    process.env.NODE_ENV === "production" &&
    process.env.TYPE_OF_DEPLOYMENT !== "commit" &&
    process.env.NF_CYPRESS_RUN === "0"
  ) {
    // tslint:disable-next-line
    console.info("Error logging is disabled");

    return noopLogger;
  }

  return new DevConsoleLogger();
};

@injectable()
class Logger implements ILogger {
  private logger: ILogger = resolveLogger();

  setUser(user: TUser | null): void {
    if (isLevelAllowed("info")) {
      this.logger.setUser(user);
    }
  }

  info(...args: LogArg): void {
    if (isLevelAllowed("info")) {
      this.logger.info(...args);
    }
  }

  debug(...args: LogArg): void {
    if (isLevelAllowed("debug")) {
      this.logger.debug(...args);
    }
  }

  warn(...args: LogArg): void {
    if (isLevelAllowed("warn")) {
      this.logger.warn(...args);
    }
  }

  error(...args: ErrorArgs): void {
    if (isLevelAllowed("error")) {
      this.logger.error(...args);
    }
  }

  fatal(...args: ErrorArgs): void {
    if (isLevelAllowed("fatal")) {
      this.logger.fatal(...args);
    }
  }
}

export { ILogger, Logger, noopLogger };
