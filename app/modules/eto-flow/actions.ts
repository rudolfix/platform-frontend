import { TFullEtoData } from "../../lib/api/EtoApi.interfaces";
import { DeepPartial } from "../../types";
import { createAction, createSimpleAction } from "../actionsUtils";

export const etoFlowActions = {
  loadDataStart: () => createSimpleAction("ETO_FLOW_LOAD_DATA_START"),
  loadData: (data: DeepPartial<TFullEtoData>) => createAction("ETO_FLOW_LOAD_DATA", { data }),
  saveDataStart: (data: DeepPartial<TFullEtoData>) =>
    createAction("ETO_FLOW_SAVE_DATA_START", { data }),
};
