import { addBigNumbers } from "../../utils/BigNumberUtils";
import { IWalletStateData } from "../wallet/reducer";
import { IIcbmWalletBalanceModal } from "./reducer";

export const selectIcbmWalletEthAddress = (state: IIcbmWalletBalanceModal): string | undefined =>
  state.ethAddress;

export const selectIcbmMigrationWallet = (
  state: IIcbmWalletBalanceModal,
): IWalletStateData | undefined => state.migrationWalletData;

export const selectEtherNeumarksDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.migrationWalletData &&
    state.migrationWalletData.etherTokenLockedWallet &&
    state.migrationWalletData.etherTokenLockedWallet.neumarksDue) ||
  "0";

export const selectEurNeumarksDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.migrationWalletData &&
    state.migrationWalletData.euroTokenLockedWallet &&
    state.migrationWalletData.euroTokenLockedWallet.neumarksDue) ||
  "0";

export const selectAllNeumakrsDueIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  addBigNumbers([selectEtherNeumarksDueIcbmModal(state), selectEurNeumarksDueIcbmModal(state)]);

export const selectEtherBalanceIcbmModal = (state: IIcbmWalletBalanceModal): string =>
  (state.migrationWalletData && state.migrationWalletData.etherBalance) || "0";

export const selectIcbmWalletConnectedIcbmModal = (state: IIcbmWalletBalanceModal): boolean =>
  !!(
    (state.migrationWalletData &&
      state.migrationWalletData.etherTokenLockedWallet &&
      state.migrationWalletData.etherTokenLockedWallet.unlockDate !== "0") ||
    (state.migrationWalletData &&
      state.migrationWalletData.euroTokenLockedWallet &&
      state.migrationWalletData.euroTokenLockedWallet.unlockDate !== "0")
  );
