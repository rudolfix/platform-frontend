import { AppReducer } from "@neufund/sagas";

import { walletActions } from "./actions";
import { IWalletState } from "./types";

const walletInitialState: IWalletState = {
  loading: true,
  error: undefined,
  data: undefined,
};

export const walletReducer: AppReducer<IWalletState, typeof walletActions> = (
  state = walletInitialState,
  action,
): IWalletState => {
  switch (action.type) {
    case walletActions.saveWalletData.getType():
      return {
        loading: false,
        error: undefined,
        data: action.payload.data,
      };
    case walletActions.loadWalletDataError.getType():
      return {
        loading: false,
        error: action.payload.errorMsg,
        data: state.data,
      };
  }

  return state;
};

const walletReducerMap = {
  wallet: walletReducer,
};

export { walletReducerMap };
