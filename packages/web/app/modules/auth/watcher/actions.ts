import { createActionFactory } from "@neufund/shared-utils";

export const authWatcherActions = {
  stopTimeoutWatcher: createActionFactory("STOP_TIMEOUT_WATCHER"),
};
