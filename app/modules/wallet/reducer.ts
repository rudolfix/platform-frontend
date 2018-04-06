import { AppReducer } from "../../store";

export interface IWalletState {
  loading: boolean;
  error?: string;
  data?: IWalletStateData;
}

// balances of all coins are represented by bignumber.js strings
export interface IWalletStateData {
  euroTokenBalance: string;
  euroTokenLockedBalance: string;
  euroTokenICBMLockedBalance: string;

  etherTokenBalance: string;
  etherTokenLockedBalance: string;
  etherTokenICBMLockedBalance: string;

  etherBalance: string;
  neuBalance: string;

  // this info should probably be somewhere else?
  etherPriceEur: string;
  neuPriceEur: string;
}

const walletInitialState: IWalletState = {
  loading: true,
};

export const walletReducer: AppReducer<IWalletState> = (
  state = walletInitialState,
  action,
): IWalletState => {
  switch (action.type) {
    case "WALLET_LOAD_WALLET_DATA":
      return {
        loading: false,
        error: undefined,
        data: action.payload.data,
      };
    case "WALLET_LOAD_WALLET_DATA_ERROR":
      return {
        loading: false,
        error: action.payload.errorMsg,
        data: undefined,
      };
  }

  return state;
};
