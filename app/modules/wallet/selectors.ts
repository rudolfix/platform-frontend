import BigNumber from "bignumber.js";
import { IWalletState, IWalletStateData } from "./reducer";

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
export const selectLiquidEtherBalance = (state: IWalletStateData) =>
  addBigNumbers([state.etherBalance, state.etherTokenBalance]);

export const selectLiquidEuroTokenBalance = (state: IWalletStateData) => state.euroTokenBalance;

export const selectLiquidEtherBalanceEuroAmount = (state: IWalletStateData) =>
  multiplyBigNumbers([state.etherPriceEur, selectLiquidEtherBalance(state)]);

export const selectLiquidEuroTotalAmount = (state: IWalletStateData) =>
  addBigNumbers([selectLiquidEuroTokenBalance(state), selectLiquidEtherBalanceEuroAmount(state)]);

/**
 * Locked Assets
 */
export const selectLockedEtherBalance = (state: IWalletStateData) =>
  addBigNumbers([state.etherTokenLockedBalance, state.etherICBMLockedBalance]);

export const selectLockedEuroTokenBalance = (state: IWalletStateData) =>
  addBigNumbers([state.euroTokenLockedBalance, state.euroTokenICBMLockedBalance]);

export const selectIsLoaded = (state: IWalletState): boolean => !state.loading;
