import BigNumber from "bignumber.js";
import { IWalletState, IWalletStateLoaded } from "./reducer";

/**
 * helper for adding up array of big numbers
 */
const addBigNumbers = (numbers: string[]): string =>
  numbers
    .reduce((aggr, number) => {
      return aggr.plus(new BigNumber(number));
    }, new BigNumber(0))
    .toString();

const multiplyBigNumbers = (numbers: string[]): string =>
  numbers
    .reduce((aggr, number) => {
      return aggr.mul(new BigNumber(number));
    }, new BigNumber(1))
    .toString();

/**
 * Liquid Assets
 */
export const selectLiquidEtherBalance = (state: IWalletStateLoaded) =>
  addBigNumbers([state.etherBalance, state.etherTokenBalance]);

export const selectLiquidEuroTokenBalance = (state: IWalletStateLoaded) => state.euroTokenBalance;

export const selectLiquidEtherBalanceEuroAmount = (state: IWalletStateLoaded) =>
  multiplyBigNumbers([state.etherPriceEur, selectLiquidEtherBalance(state)]);

export const selectLiquidEuroTotalAmount = (state: IWalletStateLoaded) =>
  addBigNumbers([selectLiquidEuroTokenBalance(state), selectLiquidEtherBalanceEuroAmount(state)]);

/**
 * Locked Assets
 */
export const selectLockedEtherBalance = (state: IWalletStateLoaded) =>
  addBigNumbers([state.etherTokenLockedBalance, state.etherICBMLockedBalance]);

export const selectLockedEuroTokenBalance = (state: IWalletStateLoaded) =>
  addBigNumbers([state.euroTokenLockedBalance, state.euroTokenICBMLockedBalance]);

export const selectIsLoaded = (state: IWalletState): boolean => !state.loading;
