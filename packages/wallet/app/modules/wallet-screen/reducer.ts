import { AppReducer } from "@neufund/sagas";
import { DeepReadonly } from "@neufund/shared-utils";

import { actions } from "./actions";
import { EViewState } from "./types";

interface IState {
  viewState: EViewState;
}

const initialState: IState = {
  viewState: EViewState.INITIAL,
};

export const reducer: AppReducer<IState, typeof actions> = (
  state = initialState,
  action,
): DeepReadonly<IState> => {
  switch (action.type) {
    case actions.setWalletViewState.getType(): {
      const { viewState } = action.payload;

      return {
        ...state,
        viewState: viewState,
      };
    }

    default:
      return state;
  }
};

const walletViewMap = {
  walletView: reducer,
};

export { walletViewMap };
