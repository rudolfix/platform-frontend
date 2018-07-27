import { TGeneralEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { createAction, createSimpleAction } from "../actionsUtils";
import { IEtoFiles } from "./../../lib/api/eto/EtoFileApi.interfaces";

export const etoFlowActions = {
  loadDataStart: () => createSimpleAction("ETO_FLOW_LOAD_DATA_START"),
  submitDataStart: () => createSimpleAction("ETO_FLOW_SUBMIT_DATA_START"),
  loadData: (data: Partial<TGeneralEtoData>) => createAction("ETO_FLOW_LOAD_DATA", { data }),
  saveDataStart: (data: Partial<TGeneralEtoData>) =>
    createAction("ETO_FLOW_SAVE_DATA_START", { data }),
  loadFileData: (etoFileData: IEtoFiles) =>
    createAction("ETO_FLOW_LOAD_FILE_DATA", { etoFileData }),
  loadFileDataStart: () => createSimpleAction("ETO_FLOW_LOAD_FILE_DATA_START"),
};
