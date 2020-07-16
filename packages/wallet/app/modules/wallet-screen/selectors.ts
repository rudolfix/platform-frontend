import { walletApi, txHistoryApi } from "@neufund/shared-modules";
import { ECurrency, ETH_DECIMALS, EURO_DECIMALS } from "@neufund/shared-utils";
import { createSelector } from "reselect";

import { hasFunds, isMainBalance } from "modules/wallet-screen/utils";

import { createToken } from "utils/createToken";

import { EBalanceViewType, TBalance, TWalletViewModuleState } from "./types";

const selectWalletViewState = (state: TWalletViewModuleState) => state.walletView.viewState;

const selectWalletTotalBalanceInEur = createSelector(
  walletApi.selectors.selectTotalEuroBalance,
  totalEurBalance => createToken(ECurrency.EUR, totalEurBalance, EURO_DECIMALS),
);

/**
 * Groups all liquid/locked/icbm locked balances into single value for ETH and EUR
 */
const selectWalletGroupedBalances = createSelector(
  // eth
  walletApi.selectors.selectTotalEtherBalance,
  walletApi.selectors.selectTotalEtherBalanceEuroAmount,

  // nEuro
  walletApi.selectors.selectTotalEuroTokenBalance,
  (ethBalance, ethEuroBalance, nEurBalance): TBalance[] => [
    {
      type: EBalanceViewType.ETH,
      amount: createToken(ECurrency.ETH, ethBalance, ETH_DECIMALS),
      euroEquivalentAmount: createToken(ECurrency.EUR, ethEuroBalance, ETH_DECIMALS),
    },
    {
      type: EBalanceViewType.NEUR,
      amount: createToken(ECurrency.EUR_TOKEN, nEurBalance, ETH_DECIMALS),
      euroEquivalentAmount: createToken(ECurrency.EUR, nEurBalance, ETH_DECIMALS),
    },
  ],
);

const selectWalletBalances = createSelector(
  // eth
  walletApi.selectors.selectLiquidEtherBalance,
  walletApi.selectors.selectLiquidEtherBalanceEuroAmount,

  // nEuro
  walletApi.selectors.selectLiquidEuroTokenBalance,

  // icbm ether
  walletApi.selectors.selectLockedEtherBalance,
  walletApi.selectors.selectLockedEtherBalanceEuroAmount,

  // icbm neur
  walletApi.selectors.selectLockedEuroTokenBalance,

  // locked icbm eth
  walletApi.selectors.selectICBMLockedEtherBalance,
  walletApi.selectors.selectICBMLockedEtherBalanceEuroAmount,

  // locked icbm neur
  walletApi.selectors.selectICBMLockedEuroTokenBalance,
  (
    ethBalance,
    ethEuroBalance,
    nEurBalance,
    icbmEthBalance,
    icbmEthEuroBalance,
    icbmEuroBalance,
    lockedIcbmEthBalance,
    lockedIcbmEthEuroBalance,
    lockedIcbmEuroBalance,
  ): TBalance[] => [
    {
      type: EBalanceViewType.ETH,
      amount: createToken(ECurrency.ETH, ethBalance, ETH_DECIMALS),
      euroEquivalentAmount: createToken(ECurrency.EUR, ethEuroBalance, ETH_DECIMALS),
    },
    {
      type: EBalanceViewType.ICBM_ETH,
      amount: createToken(ECurrency.ETH, icbmEthBalance, ETH_DECIMALS),
      euroEquivalentAmount: createToken(ECurrency.EUR, icbmEthEuroBalance, ETH_DECIMALS),
    },
    {
      type: EBalanceViewType.LOCKED_ICBM_ETH,
      amount: createToken(ECurrency.ETH, lockedIcbmEthBalance, ETH_DECIMALS),
      euroEquivalentAmount: createToken(ECurrency.EUR, lockedIcbmEthEuroBalance, ETH_DECIMALS),
    },
    {
      type: EBalanceViewType.NEUR,
      amount: createToken(ECurrency.EUR_TOKEN, nEurBalance, ETH_DECIMALS),
      euroEquivalentAmount: createToken(ECurrency.EUR, nEurBalance, ETH_DECIMALS),
    },
    {
      type: EBalanceViewType.ICBM_NEUR,
      amount: createToken(ECurrency.EUR_TOKEN, icbmEuroBalance, ETH_DECIMALS),
      euroEquivalentAmount: createToken(ECurrency.EUR, icbmEuroBalance, ETH_DECIMALS),
    },
    {
      type: EBalanceViewType.LOCKED_ICBM_NEUR,
      amount: createToken(ECurrency.EUR_TOKEN, lockedIcbmEuroBalance, ETH_DECIMALS),
      euroEquivalentAmount: createToken(ECurrency.EUR, lockedIcbmEuroBalance, ETH_DECIMALS),
    },
  ],
);

const selectWalletViewData = createSelector(
  selectWalletBalances,
  txHistoryApi.selectors.selectTxHistoryPaginated,
  selectWalletTotalBalanceInEur,
  selectWalletViewState,
  (balances, transactionsHistoryPaginated, totalBalanceInEur, viewState) => ({
    viewState,
    transactionsHistoryPaginated,
    totalBalanceInEur,
    balances: balances.filter(balance => isMainBalance(balance) || hasFunds(balance)),
  }),
);

export {
  selectWalletViewData,
  selectWalletBalances,
  selectWalletGroupedBalances,
  selectWalletTotalBalanceInEur,
};
