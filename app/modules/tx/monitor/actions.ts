import { createSimpleAction } from "../../actionsUtils";

export const txMonitorActions = {
  startTxMonitor: () => createSimpleAction("TX_MONITOR_START"),
  stopTxMonitor: () => createSimpleAction("TX_MONITOR_STOP"),
};
