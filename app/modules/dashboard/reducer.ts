import { TInvestorEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface IDashBoardState {
  etos: TInvestorEtoData[];
}

export const dashboardInitialState: IDashBoardState = {
  etos: [],
};

export const dashboardReducer: AppReducer<IDashBoardState> = (
  state = dashboardInitialState,
  action,
): DeepReadonly<IDashBoardState> => {
  switch (action.type) {
    case "DASHBOARD_SET_ETOS":
      return {
        ...state,
        etos: action.payload.etos,
      };
  }

  return state;
};
