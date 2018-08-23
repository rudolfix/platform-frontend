import { AppReducer } from "../../store";

export interface IWalletState {
  loading: boolean;
  error?: string;
  data?: IWalletStateData;
}

export interface ILockedWallet {
  ICBMLockedBalance: string;
  neumarksDue: string;
  unlockDate: string;
}

// balances of all coins are represented by bignumber.js strings
export interface IWalletStateData {
  euroTokenLockedWallet?: ILockedWallet; // ICBM Wallet
  etherTokenLockedWallet?: ILockedWallet; // ICBM Wallet

  etherTokenBalance: string;
  euroTokenBalance: string;
  etherBalance: string;
  neuBalance: string;

  euroTokenLockedBalance: string;
  etherTokenLockedBalance: string;
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
