import { TInvestorEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";

export const dashboardActions = {
  signDummyMessage: (message: string) => createAction("DASHBOARD_SIGN_DUMMY_MESSAGE", { message }),
  sendDummyTx: () => createSimpleAction("DASHBOARD_SEND_DUMMY_TX"),
  loadEtos: () => createSimpleAction("DASHBOARD_LOAD_ETOS"),
  setEtos: (etos: TInvestorEtoData[]) => createAction("DASHBOARD_SET_ETOS", {etos}),
};
