import { IAppState } from "./../../store";
import { IIcbmWalletBalanceModal, IWalletMigrationData, TWalletMigrationSteps } from "./reducer";

export const selectIcbmWalletEthAddress = (state: IIcbmWalletBalanceModal): string | undefined =>
  state.icbmWalletEthAddress;

export const selectEtherNeumarksDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.icbmLockedEthWallet && state.icbmLockedEthWallet.neumarksDue) || "0";

export const selectEurNeumarksDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.icbmLockedEthWallet && state.icbmLockedEthWallet.neumarksDue) || "0";

export const selectEtherBalanceIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.icbmLockedEthWallet && state.icbmLockedEthWallet.LockedBalance) || "0";

export const selectWalletMigrationData = (
  state: IIcbmWalletBalanceModal,
): IWalletMigrationData[] | undefined => state.walletMigrationData;

export const selectWalletMigrationCurrentStep = (state: IAppState): TWalletMigrationSteps =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.currentMigrationStep;

export const selectIcbmModalIsMigrating = (state: IAppState): boolean =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.isMigrating;

export const selectIcbmModalIsFirstTransactionDone = (state: IAppState): boolean =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.firstTransactionDone;

export const selectIcbmModalIsSecondTransactionDone = (state: IAppState): boolean =>
  state.icbmWalletBalanceModal && state.icbmWalletBalanceModal.secondTransactionDone;
