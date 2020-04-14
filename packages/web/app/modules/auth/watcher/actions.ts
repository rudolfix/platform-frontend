import { createActionFactory } from "@neufund/shared";

export const authWatcherActions = {
  stopTimeoutWatcher: createActionFactory("STOP_TIMEOUT_WATCHER"),
};
