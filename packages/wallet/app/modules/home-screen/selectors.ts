import { investorPortfolioModuleApi, walletApi } from "@neufund/shared-modules";
import {
  addBigNumbers,
  assertNever,
  convertFromUlps,
  ECurrency,
  ETH_DECIMALS,
  EURO_DECIMALS,
  multiplyBigNumbers,
  nonNullable,
  toEquityTokenSymbol,
} from "@neufund/shared-utils";
import { createSelector } from "reselect";

import { EScreenState } from "modules/types";

import { createToken } from "utils/createToken";

import { THomeScreenState, EBalanceViewType, TBalance, TAsset } from "./types";

const selectHomeScreenState = (state: THomeScreenState) => state.homeScreen.screenState;

const selectNeuBalance = createSelector(walletApi.selectors.selectNeuBalance, neuBalance =>
  createToken(ECurrency.NEU, neuBalance, ETH_DECIMALS),
);

const selectNeuBalanceEur = createSelector(
  walletApi.selectors.selectNeuBalanceEuroAmount,
  neuBalance => createToken(ECurrency.EUR, neuBalance, ETH_DECIMALS),
);

const selectTotalPortfolioBalanceEur = createSelector(
  investorPortfolioModuleApi.selectors.selectMyAssetsEurEquivTotalWithNeu,
  investorPortfolioModuleApi.selectors.selectMyPendingAssetsInvestedTotal,
  (myAssetsTotalEur = "0", myPendingAssetsTotalEEur = "0") =>
    createToken(
      ECurrency.EUR,
      addBigNumbers([myAssetsTotalEur, myPendingAssetsTotalEEur]),
      EURO_DECIMALS,
    ),
);

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

const selectPortfolioAssets = createSelector(
  investorPortfolioModuleApi.selectors.selectMyAssetsWithTokenData,
  assets =>
    assets?.map<TAsset>(asset => ({
      id: asset.etoId,
      token: createToken(
        toEquityTokenSymbol(asset.equityTokenSymbol),
        asset.tokenData.balanceUlps,
        EURO_DECIMALS,
      ),
      analogToken: createToken(
        ECurrency.EUR,
        multiplyBigNumbers([
          asset.tokenData.tokenPrice,
          convertFromUlps(asset.tokenData.balanceUlps, asset.tokenData.balanceDecimals),
        ]),
        EURO_DECIMALS,
      ),
      tokenImage: asset.equityTokenImage,
      tokenName: asset.equityTokenName,
    })),
);

const selectHomeScreenData = createSelector(
  selectWalletGroupedBalances,
  selectWalletTotalBalanceInEur,
  selectPortfolioAssets,
  selectNeuBalance,
  selectNeuBalanceEur,
  selectTotalPortfolioBalanceEur,
  selectHomeScreenState,
  (
    balances,
    totalBalanceInEur,
    portfolioAssets,
    neuBalance,
    neuBalanceEur,
    totalPortfolioBalanceEur,
    screenState,
  ) => {
    switch (screenState) {
      case EScreenState.LOADING:
      case EScreenState.INITIAL:
      case EScreenState.ERROR:
        return {
          screenState,
        };
      case EScreenState.REFRESHING:
      case EScreenState.READY:
        return {
          balances,
          totalBalanceInEur,
          portfolioAssets: nonNullable(portfolioAssets),
          neuBalance,
          neuBalanceEur,
          totalPortfolioBalanceEur,
          screenState,
        };

      default:
        assertNever(screenState, `Invalid screen state received`);
    }
  },
);

export { selectHomeScreenData };
