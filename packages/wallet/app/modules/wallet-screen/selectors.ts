import { walletApi, txHistoryApi } from "@neufund/shared-modules";
import { ECurrency, createToken, ENumberInputFormat } from "@neufund/shared-utils";
import { createSelector } from "reselect";

import { hasFunds, isMainBalance } from "modules/wallet-screen/utils";

import { EBalanceViewType, TBalance, TWalletScreenModuleState } from "./types";

const selectWalletScreenState = (state: TWalletScreenModuleState) => state.walletScreen.screenState;

const selectWalletTotalBalanceInEur = createSelector(
  walletApi.selectors.selectTotalEuroBalance,
  totalEurBalance => createToken(ECurrency.EUR, totalEurBalance, ENumberInputFormat.DECIMAL),
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
      amount: createToken(ECurrency.ETH, ethBalance, ENumberInputFormat.ULPS),
      euroEquivalentAmount: createToken(ECurrency.EUR, ethEuroBalance, ENumberInputFormat.ULPS),
    },
    {
      type: EBalanceViewType.ICBM_ETH,
      amount: createToken(ECurrency.ETH, icbmEthBalance, ENumberInputFormat.ULPS),
      euroEquivalentAmount: createToken(ECurrency.EUR, icbmEthEuroBalance, ENumberInputFormat.ULPS),
    },
    {
      type: EBalanceViewType.LOCKED_ICBM_ETH,
      amount: createToken(ECurrency.ETH, lockedIcbmEthBalance, ENumberInputFormat.ULPS),
      euroEquivalentAmount: createToken(
        ECurrency.EUR,
        lockedIcbmEthEuroBalance,
        ENumberInputFormat.ULPS,
      ),
    },
    {
      type: EBalanceViewType.NEUR,
      amount: createToken(ECurrency.EUR_TOKEN, nEurBalance, ENumberInputFormat.ULPS),
      euroEquivalentAmount: createToken(ECurrency.EUR, nEurBalance, ENumberInputFormat.ULPS),
    },
    {
      type: EBalanceViewType.ICBM_NEUR,
      amount: createToken(ECurrency.EUR_TOKEN, icbmEuroBalance, ENumberInputFormat.ULPS),
      euroEquivalentAmount: createToken(ECurrency.EUR, icbmEuroBalance, ENumberInputFormat.ULPS),
    },
    {
      type: EBalanceViewType.LOCKED_ICBM_NEUR,
      amount: createToken(ECurrency.EUR_TOKEN, lockedIcbmEuroBalance, ENumberInputFormat.ULPS),
      euroEquivalentAmount: createToken(
        ECurrency.EUR,
        lockedIcbmEuroBalance,
        ENumberInputFormat.ULPS,
      ),
    },
  ],
);

const selectWalletScreenData = createSelector(
  selectWalletBalances,
  txHistoryApi.selectors.selectTxHistoryPaginated,
  selectWalletTotalBalanceInEur,
  selectWalletScreenState,
  (balances, transactionsHistoryPaginated, totalBalanceInEur, screenState) => ({
    screenState,
    transactionsHistoryPaginated,
    totalBalanceInEur,
    balances: balances.filter(balance => isMainBalance(balance) || hasFunds(balance)),
  }),
);

export { selectWalletScreenData, selectWalletBalances, selectWalletTotalBalanceInEur };
