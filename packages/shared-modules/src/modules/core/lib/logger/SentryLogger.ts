import {
  addBreadcrumb,
  captureException,
  configureScope,
  init,
  SentryEvent,
  Severity,
  withScope,
} from "@sentry/browser";

import { ILogger, TUser } from "./ILogger";
import { hashBlacklistedQueryParams } from "./utils";

/**
 * Query params that should never be send to sentry for security reasons.
 */
const BLACKLISTED_QUERY_PARAMS = ["email", "salt"];

export class SentryLogger implements ILogger {
  constructor(dsn: string) {
    init({
      dsn,
      beforeSend(event: SentryEvent): SentryEvent {
        if (event.request && event.request.url) {
          event.request.url = hashBlacklistedQueryParams(
            BLACKLISTED_QUERY_PARAMS,
            event.request.url,
          );
        }

        return event;
      },
    });
  }

  setUser(user: TUser | null): void {
    configureScope(scope => {
      scope.setUser(user as any);
    });
  }

  info(message: string, data?: object): void {
    addBreadcrumb({
      category: "logger",
      data: { message, data },
      level: Severity.Info,
    });
  }

  debug(message: string, data?: object): void {
    addBreadcrumb({
      category: "logger",
      data: { message, data },
      level: Severity.Debug,
    });
  }

  warn(message: string, data?: object): void {
    withScope(scope => {
      addBreadcrumb({
        data,
        category: "logger",
        level: Severity.Warning,
      });

      scope.setLevel(Severity.Warning);

      captureException(new Error(message));
    });
  }

  error(error: Error, message?: string, data?: object): void {
    addBreadcrumb({
      category: "logger",
      data: { message, data },
      level: Severity.Error,
    });

    captureException(error);
  }

  fatal(error: Error, message?: string, data?: object): void {
    // tslint:disable-next-line
    console.error(message, error, data);

    withScope(scope => {
      addBreadcrumb({
        message,
        data,
        category: "logger",
        level: Severity.Fatal,
      });

      scope.setLevel(Severity.Fatal);

      captureException(error);
    });
  }
}
