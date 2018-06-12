import { TPartialEtoData, TPartialEtoSpecData } from "../../lib/api/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IEtoFlowState {
  loading: boolean;
  etoData: TPartialEtoSpecData;
  companyData: TPartialEtoData;
}

export const etoFlowInitialState: IEtoFlowState = {
  loading: true,
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
        // it will re-load data in the background
        loading: true,
        ...state,
      };
    case "ETO_FLOW_LOAD_DATA":
      return {
        loading: false,
        etoData: {
          ...state.etoData,
          ...action.payload.data.etoData,
        },
        companyData: {
          ...state.companyData,
          ...action.payload.data.companyData,
        },
      };
  }

  return state;
};
