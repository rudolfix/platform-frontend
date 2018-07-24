import { TPartialCompanyEtoData, TPartialEtoSpecData } from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IEtoState {
  previewLoading: { [previewCode: string]: boolean };
  previewEtoData: { [previewCode: string]: TPartialEtoSpecData | undefined };
  previewCompanyData: { [previewCode: string]: TPartialCompanyEtoData | undefined };
}

export const etoFlowInitialState: IEtoState = {
  previewLoading: {},
  previewEtoData: {},
  previewCompanyData: {},
};

export const etoReducer: AppReducer<IEtoState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IEtoState> => {
  switch (action.type) {
    case "ETO_FLOW_LOAD_ETO_PREVIEW_START":
      return {
        ...state,
        previewLoading: {
          ...state.previewLoading,
          [action.payload.previewCode]: true,
        },
      };
    case "ETO_FLOW_LOAD_ETO_PREVIEW":
      return {
        ...state,
        previewLoading: {
          ...state.previewLoading,
          [action.payload.previewCode]: false,
        },
        previewCompanyData: {
          ...state.previewCompanyData,
          [action.payload.previewCode]: action.payload.data.companyData,
        },
        previewEtoData: {
          ...state.previewEtoData,
          [action.payload.previewCode]: action.payload.data.etoData,
        },
      };
  }

  return state;
};
