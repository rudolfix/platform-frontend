import { IAppState } from "../../store";
import { addBigNumbers, multiplyBigNumbers } from "../../utils/BigNumberUtils";
import { selectEtherPriceEur } from "../shared/tokenPrice/selectors";
import { IWalletState } from "./reducer";

/**
 * Simple State Selectors
 */

export const selectNeuBalanceEuroAmount = (state: IAppState): string =>
  multiplyBigNumbers([selectEtherPriceEur(state.tokenPrice), selectNeuBalance(state.wallet)]);

export const selectNeuBalance = (state: IWalletState): string =>
  (state.data && state.data.neuBalance) || "0";
/**
 * Liquid Assets
 */
export const selectLiquidEtherBalance = (state: IWalletState) =>
  (state.data && addBigNumbers([state.data.etherBalance, state.data.etherTokenBalance])) || "0";

export const selectLiquidEtherBalanceEuroAmount = (state: IAppState) =>
  multiplyBigNumbers([
    selectEtherPriceEur(state.tokenPrice),
    selectLiquidEtherBalance(state.wallet),
  ]);

export const selectLiquidEuroTokenBalance = (state: IWalletState) =>
  (state.data && state.data.euroTokenBalance) || "0";

export const selectLiquidEuroTotalAmount = (state: IAppState) =>
  addBigNumbers([
    selectLiquidEuroTokenBalance(state.wallet),
    selectLiquidEtherBalanceEuroAmount(state),
  ]);

/**
 * Locked Wallet Assets
 */
export const selectLockedEtherBalance = (state: IWalletState) =>
  (state.data && state.data.etherTokenLockedBalance) || "0";

export const selectLockedEtherBalanceEuroAmount = (state: IAppState) =>
  multiplyBigNumbers([
    selectEtherPriceEur(state.tokenPrice),
    selectLockedEtherBalance(state.wallet),
  ]);

export const selectLockedEuroTokenBalance = (state: IWalletState) =>
  (state.data && state.data.euroTokenLockedBalance) || "0";

export const selectLockedEuroTotalAmount = (state: IAppState) =>
  addBigNumbers([
    selectLockedEtherBalanceEuroAmount(state),
    selectLockedEuroTokenBalance(state.wallet),
  ]);
export const selectLockedWalletHasFunds = (state: IAppState): boolean =>
  selectLockedEuroTotalAmount(state) !== "0";

/**
 * ICBM Wallet Assets
 */
export const selectICBMLockedEtherBalance = (state: IWalletState) =>
  (state.data &&
    state.data.etherTokenLockedWallet &&
    state.data.etherTokenLockedWallet.ICBMLockedBalance) ||
  "0";

export const selectICBMLockedEtherBalanceEuroAmount = (state: IAppState) =>
  multiplyBigNumbers([
    selectEtherPriceEur(state.tokenPrice),
    selectICBMLockedEtherBalance(state.wallet),
  ]);

export const selectICBMLockedEuroTokenBalance = (state: IWalletState) =>
  (state.data &&
    state.data.euroTokenLockedWallet &&
    state.data.euroTokenLockedWallet.ICBMLockedBalance) ||
  "0";

export const selectICBMLockedEuroTotalAmount = (state: IAppState) =>
  addBigNumbers([
    selectICBMLockedEtherBalanceEuroAmount(state),
    selectICBMLockedEuroTokenBalance(state.wallet),
  ]);
export const selectICBMLockedWalletHasFunds = (state: IAppState): boolean =>
  selectICBMLockedEuroTotalAmount(state) !== "0";

/**
 * Total wallet assets value
 */
export const selectTotalEtherBalance = (state: IWalletState) =>
  addBigNumbers([
    selectLiquidEtherBalance(state),
    selectLockedEtherBalance(state),
    selectICBMLockedEtherBalance(state),
  ]);

export const selectTotalEtherBalanceEuroAmount = (state: IAppState) =>
  addBigNumbers([
    selectLiquidEtherBalanceEuroAmount(state),
    selectLockedEtherBalanceEuroAmount(state),
    selectICBMLockedEtherBalanceEuroAmount(state),
  ]);
export const selectTotalEuroTokenBalance = (state: IWalletState) =>
  addBigNumbers([
    selectLiquidEuroTokenBalance(state),
    selectLockedEuroTokenBalance(state),
    selectICBMLockedEuroTokenBalance(state),
  ]);
export const selectTotalEuroBalance = (state: IAppState) =>
  addBigNumbers([
    selectLiquidEuroTotalAmount(state),
    selectLockedEuroTotalAmount(state),
    selectICBMLockedEuroTotalAmount(state),
  ]);

export const selectIsLoaded = (state: IWalletState): boolean => !state.loading;

export const selectEtherNeumarksDue = (state: IWalletState): string =>
  (state.data &&
    state.data.etherTokenLockedWallet &&
    state.data.etherTokenLockedWallet.neumarksDue) ||
  "0";

export const selectEurNeumarksDue = (state: IWalletState): string =>
  (state.data &&
    state.data.euroTokenLockedWallet &&
    state.data.euroTokenLockedWallet.neumarksDue) ||
  "0";

export const selectIcbmWalletConnected = (state: IWalletState): boolean =>
  !!(
    (state.data &&
      state.data.etherTokenLockedWallet &&
      state.data.etherTokenLockedWallet.unlockDate !== "0") ||
    (state.data &&
      state.data.euroTokenLockedWallet &&
      state.data.euroTokenLockedWallet.unlockDate !== "0")
  );
