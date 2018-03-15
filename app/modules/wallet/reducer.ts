import BigNumber from "bignumber.js";
import { AppReducer } from "../../store";

// balances of all coins are represented by bignumber.js strings
export interface IWalletState {
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

const walletInitialState: IWalletState = {
  euroTokenBalance: new BigNumber("2500e18").toString(),
  euroTokenLockedBalance: new BigNumber("5000e18").toString(),
  euroTokenICBMLockedBalance: new BigNumber("7200e18").toString(),

  etherBalance: new BigNumber("14.23e18").toString(),
  etherTokenBalance: new BigNumber("15.53e18").toString(),
  etherTokenLockedBalance: new BigNumber("2.23e18").toString(),
  etherICBMLockedBalance: new BigNumber("12.23e18").toString(),

  neuBalance: new BigNumber("4599.87e18").toString(),

  etherPriceEur: new BigNumber("499").toString(),
  neuPriceEur: new BigNumber("0.500901").toString(),
};

export const walletReducer: AppReducer<IWalletState> = (
  state = walletInitialState,
  _action,
): IWalletState => {
  return state;
};
