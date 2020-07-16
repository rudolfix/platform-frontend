import { createSelector } from "reselect";

import { walletViewModuleApi } from "modules/wallet-screen/module";

import { TWalletViewModuleState } from "./types";

const selectWalletViewState = (state: TWalletViewModuleState) => state.homeView.viewState;

const selectHomeViewData = createSelector(
  walletViewModuleApi.selectors.selectWalletGroupedBalances,
  walletViewModuleApi.selectors.selectWalletTotalBalanceInEur,
  selectWalletViewState,
  (balances, totalBalanceInEur, viewState) => ({
    balances,
    totalBalanceInEur,
    viewState,
  }),
);

export { selectHomeViewData };
