import { TPartialCompanyEtoData, TPartialEtoSpecData } from "../../lib/api/eto/EtoApi.interfaces";
import { IEtoFiles } from "../../lib/api/eto/EtoFileApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IEtoDocumentState {
  loading: boolean;
  saving: boolean;
  showIpfsModal: boolean;
  etoFileData: IEtoFiles;
  uploadAction?: () => void;
}
// TODO: Add correct type for etoFileData once backend is connected

export const etoFlowInitialState: IEtoDocumentState = {
  loading: false,
  saving: false,
  etoFileData: {
    etoTemplates: {},
    uploadedDocuments: {},
  },
  showIpfsModal: false,
};

export const etoDocumentReducer: AppReducer<IEtoDocumentState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IEtoDocumentState> => {
  switch (action.type) {
    case "ETO_FLOW_LOAD_FILE_DATA_START":
      return {
        ...state,
        loading: true,
      };
    case "ETO_FLOW_LOAD_ETO_FILE_DATA":
      return {
        ...state,
        etoFileData: { ...state.etoFileData, ...action.payload.data },
        loading: false,
        saving: false,
      };
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
