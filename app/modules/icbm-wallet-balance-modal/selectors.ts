import { addBigNumbers } from "../../utils/BigNumberUtils";
import { IAppState } from "./../../store";
import { IIcbmWalletBalanceModal, IWalletMigrationData, TWalletMigrationSteps } from "./reducer";

export const selectIcbmWalletEthAddress = (state: IIcbmWalletBalanceModal): string | undefined =>
  state.icbmWalletEthAddress;

export const selectEtherNeumarksDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.lockedWallet && state.lockedWallet.lockedEtherIcbmWallet.neumarksDue) || "0";

export const selectEurNeumarksDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.lockedWallet && state.lockedWallet.lockedEuroIcbmWallet.neumarksDue) || "0";

export const selectAllNeumakrsDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  addBigNumbers([selectEtherNeumarksDueIcbmModal(state), selectEurNeumarksDueIcbmModal(state)]);

export const selectEtherBalanceIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.lockedWallet && state.lockedWallet.lockedEtherIcbmWallet.LockedBalance) || "0";


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
