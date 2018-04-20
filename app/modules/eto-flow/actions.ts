import { TEtoData } from "../../lib/api/EtoApi.interfaces";
import { createAction } from "../actionsUtils";

export const etoFlowActions = {
  loadData: (data: Partial<TEtoData>) => createAction("ETO_FLOW_LOAD_DATA", { data }),
};
