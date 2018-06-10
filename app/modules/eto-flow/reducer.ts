import { TPartialEtoData } from "../../lib/api/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IEtoFlowState {
  loading: boolean;
  data: TPartialEtoData;
}

export const etoFlowInitialState: IEtoFlowState = {
  loading: true,
  data: {
    categories: [],
  },
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
        data: {
          ...state.data,
          ...action.payload.data,
        },
      };
  }

  return state;
};
