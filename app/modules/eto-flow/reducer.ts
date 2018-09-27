import { TPartialCompanyEtoData, TPartialEtoSpecData } from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IEtoFlowState {
  loading: boolean;
  saving: boolean;
  etoData: TPartialEtoSpecData;
  companyData: TPartialCompanyEtoData;
}

export const etoFlowInitialState: IEtoFlowState = {
  loading: false,
  saving: false,
  etoData: {},
  companyData: {},
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
    case "ETO_FLOW_LOAD_DATA_STOP":
      return {
        ...state,
        loading: false,
        saving: false,
      };
    case "ETO_FLOW_SAVE_DATA_START":
    case "ETO_FLOW_SUBMIT_DATA_START":
      return {
        ...state,
        saving: true,
      };
  }
  return state;
};
