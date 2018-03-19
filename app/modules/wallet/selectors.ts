import BigNumber from "bignumber.js";
import { IWalletState } from "./reducer";

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
export const selectLiquidEtherBalance = (state: IWalletState) =>
  addBigNumbers([state.etherBalance, state.etherTokenBalance]);

export const selectLiquidEuroTokenBalance = (state: IWalletState) => state.euroTokenBalance;

export const selectLiquidEtherBalanceEuroAmount = (state: IWalletState) =>
  multiplyBigNumbers([state.etherPriceEur, selectLiquidEtherBalance(state)]);

export const selectLiquidEuroTotalAmount = (state: IWalletState) =>
  addBigNumbers([selectLiquidEuroTokenBalance(state), selectLiquidEtherBalanceEuroAmount(state)]);

/**
 * Locked Assets
 */
export const selectLockedEtherBalance = (state: IWalletState) =>
  addBigNumbers([state.etherTokenLockedBalance, state.etherICBMLockedBalance]);

export const selectLockedEuroTokenBalance = (state: IWalletState) =>
  addBigNumbers([state.euroTokenLockedBalance, state.euroTokenICBMLockedBalance]);
