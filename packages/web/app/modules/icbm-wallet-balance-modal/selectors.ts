import { DeepReadonly } from "@neufund/shared-utils";

import { TAppGlobalState } from "../../store";
import { IIcbmWalletBalanceModal, IWalletMigrationData, TWalletMigrationSteps } from "./reducer";

// ICBM Wallet Selectors
export const selectIcbmWalletEthAddress = (state: TAppGlobalState): string | undefined =>
  state.icbmWalletBalanceModal.icbmWalletEthAddress;

export const selectEtherNeumarksDueIcbmModal = (state: TAppGlobalState): string =>
  (state.icbmWalletBalanceModal.icbmLockedEthWallet &&
    state.icbmWalletBalanceModal.icbmLockedEthWallet.neumarksDue) ||
  "0";

export const selectEtherBalanceIcbmModal = (state: TAppGlobalState): string =>
  (state.icbmWalletBalanceModal.icbmLockedEthWallet &&
    state.icbmWalletBalanceModal.icbmLockedEthWallet.LockedBalance) ||
  "0";

// Migration Tool Selectors
export const selectWalletMigrationData = (
  state: DeepReadonly<IIcbmWalletBalanceModal>,
): ReadonlyArray<IWalletMigrationData> | undefined => state.walletMigrationData;

export const selectWalletMigrationCurrentStep = (state: TAppGlobalState): TWalletMigrationSteps =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.currentMigrationStep;

export const selectIcbmModalIsMigrating = (state: TAppGlobalState): boolean =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.isMigrating;

export const selectIcbmModalIsFirstTransactionDone = (state: TAppGlobalState): boolean =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.firstTransactionDone;

export const selectIcbmModalIsSecondTransactionDone = (state: TAppGlobalState): boolean =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.secondTransactionDone;
