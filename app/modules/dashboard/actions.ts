import { createAction, createSimpleAction } from "../actionsUtils";

export const dashboardActions = {
  signDummyMessage: (message: string) => createAction("DASHBOARD_SIGN_DUMMY_MESSAGE", { message }),
  sendDummyTx: () => createSimpleAction("DASHBOARD_SEND_DUMMY_TX"),
};
