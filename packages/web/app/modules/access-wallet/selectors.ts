import { createSelector } from "reselect";

import { TAppGlobalState } from "../../store";

export const selectAccessWallet = (state: TAppGlobalState) => state.accessWallet;

export const selectIsAccessWalletModalOpen = createSelector(
  selectAccessWallet,
  accessWallet => accessWallet.isModalOpen,
);
