import { ILogger } from "@neufund/shared-modules";
import { Container } from "inversify";
import { AnyAction, Middleware } from "redux";

import { symbols } from "../di/symbols";

const logDispatchedActions = (action: AnyAction, container: Container) => {
  // Do not log internal "redux-dynamic-modules" actions as they are dispatched
  // just before container is properly injected therefore logger is unavailable yet
  if (!action.type.startsWith("@@Internal/ModuleManager/")) {
    const logger = container.get<ILogger>(symbols.logger);

    logger.info(`[redux-action] ${action.type}`);
  }
};

export const reduxLogger = (container: Container): Middleware => () => next => (
  action: AnyAction,
) => {
  logDispatchedActions(action, container);

  return next(action);
};
