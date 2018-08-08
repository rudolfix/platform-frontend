import { TPartialCompanyEtoData, TPartialEtoSpecData } from "../../lib/api/eto/EtoApi.interfaces";
import { IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IEtoFlowState {
  loading: boolean;
  etoFileLoading: boolean;
  saving: boolean;
  showIpfsModal: boolean;
  etoData: TPartialEtoSpecData;
  companyData: TPartialCompanyEtoData;
  etoFileData: IEtoFiles;
  uploadAction?: () => void;
}
// TODO: Add correct type for etoFileData once backend is connected

export const etoFlowInitialState: IEtoFlowState = {
  loading: false,
  etoFileLoading: false,
  saving: false,
  etoData: {},
  companyData: {},
  etoFileData: {
    generatedDocuments: [],
    uploadedDocuments: {
      pamphlet: {},
      termSheet: {},
      infoBlatt: {},
      bafinProspectus: {},
      signedAgreement: {},
    },
  },
  showIpfsModal: false,
};

export const etoFlowReducer: AppReducer<IEtoFlowState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IEtoFlowState> => {
  switch (action.type) {
    case "ETO_FLOW_LOAD_DATA_START":
      return {
        ...state,
        loading: true,
      };
    case "ETO_FLOW_LOAD_FILE_DATA_START":
      return {
        ...state,
        etoFileLoading: true,
      };
    case "ETO_FLOW_LOAD_DATA":
      return {
        ...state,
        etoData: {
          ...state.etoData,
          ...action.payload.data.etoData,
        },
        companyData: {
          ...state.companyData,
          ...action.payload.data.companyData,
        },
        loading: false,
        saving: false,
      };
    case "ETO_FLOW_LOAD_ETO_FILE_DATA":
      return {
        ...state,
        etoFileData: { ...state.etoFileData, ...action.payload.data },
        etoFileLoading: false,
        saving: false,
      };
    case "ETO_FLOW_SAVE_DATA_START":
    case "ETO_FLOW_SUBMIT_DATA_START":
    case "ETO_FLOW_UPLOAD_DOCUMENT_START":
      return {
        ...state,
        saving: true,
      };
    case "ETO_FLOW_IPFS_MODAL_SHOW":
      return {
        ...state,
        uploadAction: action.payload.fileUploadAction,
        showIpfsModal: true,
      };
    case "ETO_FLOW_IPFS_MODAL_HIDE":
      return {
        ...state,
        uploadAction: undefined,
        showIpfsModal: false,
      };
  }

  return state;
};
