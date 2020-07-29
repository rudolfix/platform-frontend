import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { EScreenState } from "modules/types";

import { actions } from "./actions";

interface IState {
  screenState: EScreenState;
}

const initialState: IState = {
  screenState: EScreenState.INITIAL,
};

export const reducer: AppReducer<IState, typeof actions> = (
  state = initialState,
  action,
): DeepReadonly<IState> => {
  switch (action.type) {
    case actions.setPortfolioScreenState.getType(): {
      const { screenState } = action.payload;

      return {
        ...state,
        screenState,
      };
    }

    default:
      return state;
  }
};

const portfolioScreenReducerMap = {
  portfolioScreen: reducer,
};

export { portfolioScreenReducerMap };
