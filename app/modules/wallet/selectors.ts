import { addBigNumbers, multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { IWalletState, IWalletStateData } from "./reducer";

/**
 * Liquid Assets
 */
export const selectLiquidEtherBalance = (state: IWalletStateData) =>
  addBigNumbers([state.etherBalance, state.etherTokenBalance]);
export const selectLiquidEtherBalanceEuroAmount = (state: IWalletStateData) =>
  multiplyBigNumbers([state.etherPriceEur, selectLiquidEtherBalance(state)]);
export const selectLiquidEuroTokenBalance = (state: IWalletStateData) => state.euroTokenBalance;
export const selectLiquidEuroTotalAmount = (state: IWalletStateData) =>
  addBigNumbers([selectLiquidEuroTokenBalance(state), selectLiquidEtherBalanceEuroAmount(state)]);

/**
 * Locked Wallet Assets
 */
export const selectLockedEtherBalance = (state: IWalletStateData) => state.etherTokenLockedBalance;
export const selectLockedEtherBalanceEuroAmount = (state: IWalletStateData) =>
  multiplyBigNumbers([state.etherPriceEur, state.etherTokenLockedBalance]);
export const selectLockedEuroTokenBalance = (state: IWalletStateData) =>
  state.euroTokenLockedBalance;
export const selectLockedEuroTotalAmount = (state: IWalletStateData) =>
  addBigNumbers([selectLockedEtherBalanceEuroAmount(state), selectLockedEuroTokenBalance(state)]);
export const selectLockedWalletHasFunds = (state: IWalletStateData): boolean =>
  selectLockedEuroTotalAmount(state) !== "0";

/**
 * ICBM Wallet Assets
 */
export const selectICBMLockedEtherBalance = (state: IWalletStateData) =>
  state.euroTokenICBMLockedBalance;
export const selectICBMLockedEtherBalanceEuroAmount = (state: IWalletStateData) =>
  multiplyBigNumbers([state.etherPriceEur, state.etherTokenICBMLockedBalance]);
export const selectICBMLockedEuroTokenBalance = (state: IWalletStateData) =>
  state.euroTokenICBMLockedBalance;
export const selectICBMLockedEuroTotalAmount = (state: IWalletStateData) =>
  addBigNumbers([selectLockedEtherBalanceEuroAmount(state), selectLockedEuroTokenBalance(state)]);
export const selectICBMLockedWalletHasFunds = (state: IWalletStateData): boolean =>
  selectICBMLockedEuroTotalAmount(state) !== "0";

/**
 * Total wallet assets value
 */
export const selectTotalEtherBalance = (state: IWalletStateData) =>
  addBigNumbers([
    selectLiquidEtherBalance(state),
    selectLockedEtherBalance(state),
    selectICBMLockedEtherBalance(state),
  ]);
export const selectTotalEtherBalanceEuroAmount = (state: IWalletStateData) =>
  addBigNumbers([
    selectLiquidEtherBalanceEuroAmount(state),
    selectLockedEtherBalanceEuroAmount(state),
    selectICBMLockedEtherBalanceEuroAmount(state),
  ]);
export const selectTotalEuroTokenBalance = (state: IWalletStateData) =>
  addBigNumbers([
    selectLiquidEuroTokenBalance(state),
    selectLockedEuroTokenBalance(state),
    selectICBMLockedEuroTokenBalance(state),
  ]);
export const selectTotalEuroBalance = (state: IWalletStateData) =>
  addBigNumbers([
    selectLiquidEuroTotalAmount(state),
    selectLockedEuroTotalAmount(state),
    selectICBMLockedEuroTotalAmount(state),
  ]);

export const selectIsLoaded = (state: IWalletState): boolean => !state.loading;
