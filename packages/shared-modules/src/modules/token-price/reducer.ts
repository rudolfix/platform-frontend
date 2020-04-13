import { AppReducer } from "@neufund/sagas";

import { tokenPriceActions } from "./actions";

export interface ITokenPriceState {
  loading: boolean;
  error?: string;
  tokenPriceData?: ITokenPriceStateData;
}

// balances of all coins are represented by bignumber.js strings
export interface ITokenPriceStateData {
  etherPriceEur: string;
  neuPriceEur: string;
  eurPriceEther: string;
  priceOutdated: boolean;
}

const walletInitialState: ITokenPriceState = {
  loading: true,
};

const tokenPriceReducer: AppReducer<ITokenPriceState, typeof tokenPriceActions> = (
  state = walletInitialState,
  action,
): ITokenPriceState => {
  switch (action.type) {
    case tokenPriceActions.loadTokenPriceStart.getType():
      return {
        ...state,
        loading: true,
      };
    case tokenPriceActions.saveTokenPrice.getType():
      return {
        ...state,
        loading: false,
        tokenPriceData: action.payload.tokenPriceData,
      };
  }

  return state;
};

export const tokenPriceReducerMap = {
  tokenPrice: tokenPriceReducer,
};
