import { TPartialCompanyEtoData, TPartialEtoSpecData } from "../../lib/api/eto/EtoApi.interfaces";
import { IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IEtoFlowState {
  loading: boolean;
  saving: boolean;
  etoData: TPartialEtoSpecData;
  companyData: TPartialCompanyEtoData;
  etoFileData: IEtoFiles;
}
// TODO: Add correct type for etoFileData once backend is connected

export const etoFlowInitialState: IEtoFlowState = {
  loading: false,
  saving: false,
  etoData: {},
  companyData: {},
  etoFileData: { links: [], generatedDocuments: [], uploadedDocuments: {} },
};

export const etoFlowReducer: AppReducer<IEtoFlowState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IEtoFlowState> => {
  switch (action.type) {
    case "ETO_FLOW_LOAD_DATA_START":
    case "ETO_FLOW_LOAD_FILE_DATA_START":
      return {
        ...state,
        loading: true,
      };
    case "ETO_FLOW_LOAD_DATA":
      return {
        ...state,
        loading: false,
        saving: false,
        etoData: {
          ...state.etoData,
          ...action.payload.data.etoData,
        },
        companyData: {
          ...state.companyData,
          ...action.payload.data.companyData,
        },
      };
    case "ETO_FLOW_LOAD_ETO_FILE_DATA":
      return {
        ...state,
        loading: false,
        saving: false,
        etoFileData: { ...state.etoFileData, ...action.payload.data },
      };
    case "ETO_FLOW_SAVE_DATA_START":
    case "ETO_FLOW_SUBMIT_DATA_START":
    case "ETO_FLOW_UPLOAD_DOCUMENT_START":
      return {
        ...state,
        saving: true,
      };
  }

  return state;
};
