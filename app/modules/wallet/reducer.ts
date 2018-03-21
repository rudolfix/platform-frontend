import { AppReducer } from "../../store";

interface IWalletStateNotLoaded {
  loading: true;
}

// balances of all coins are represented by bignumber.js strings
export interface IWalletStateData {
  euroTokenBalance: string;
  euroTokenLockedBalance: string;
  euroTokenICBMLockedBalance: string;

  etherBalance: string;
  etherTokenBalance: string;
  etherTokenLockedBalance: string;
  etherICBMLockedBalance: string;

  neuBalance: string;

  // this info should probably be somewhere else?
  etherPriceEur: string;
  neuPriceEur: string;
}

export interface IWalletStateLoaded extends IWalletStateData {
  loading: false;
}

export type IWalletState = IWalletStateNotLoaded | IWalletStateLoaded;

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
        ...action.payload.data,
      };
  }

  return state;
};
