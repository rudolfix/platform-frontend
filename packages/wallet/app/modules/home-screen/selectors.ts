import { investorPortfolioModuleApi, walletApi, etoModuleApi } from "@neufund/shared-modules";
import {
  addBigNumbers,
  assertNever,
  convertFromUlps,
  createToken,
  ECurrency,
  ENumberInputFormat,
  multiplyBigNumbers,
  nonNullable,
  toEquityTokenSymbol,
} from "@neufund/shared-utils";
import { createSelector } from "reselect";

import { EScreenState } from "modules/types";

import { EBalanceViewType, TAsset, TBalance, THomeScreenState } from "./types";

const selectHomeScreenState = (state: THomeScreenState) => state.homeScreen.screenState;

const selectNeuBalance = createSelector(walletApi.selectors.selectNeuBalance, neuBalance =>
  createToken(ECurrency.NEU, neuBalance, ENumberInputFormat.ULPS),
);

const selectNeuBalanceEur = createSelector(
  walletApi.selectors.selectNeuBalanceEuroAmount,
  neuBalance => createToken(ECurrency.EUR, neuBalance, ENumberInputFormat.ULPS),
);

const selectTotalPortfolioBalanceEur = createSelector(
  investorPortfolioModuleApi.selectors.selectMyAssetsEurEquivTotalWithNeu,
  investorPortfolioModuleApi.selectors.selectMyPendingAssetsInvestedTotal,
  (myAssetsTotalEur = "0", myPendingAssetsTotalEEur = "0") =>
    createToken(
      ECurrency.EUR,
      addBigNumbers([myAssetsTotalEur, myPendingAssetsTotalEEur]),
      ENumberInputFormat.DECIMAL,
    ),
);

const selectWalletTotalBalanceInEur = createSelector(
  walletApi.selectors.selectTotalEuroBalance,
  totalEurBalance => createToken(ECurrency.EUR, totalEurBalance, ENumberInputFormat.DECIMAL),
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
      amount: createToken(ECurrency.ETH, ethBalance, ENumberInputFormat.ULPS),
      euroEquivalentAmount: createToken(ECurrency.EUR, ethEuroBalance, ENumberInputFormat.ULPS),
    },
    {
      type: EBalanceViewType.NEUR,
      amount: createToken(ECurrency.EUR_TOKEN, nEurBalance, ENumberInputFormat.ULPS),
      euroEquivalentAmount: createToken(ECurrency.EUR, nEurBalance, ENumberInputFormat.ULPS),
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
        ENumberInputFormat.DECIMAL,
      ),
      analogToken: createToken(
        ECurrency.EUR,
        multiplyBigNumbers([
          asset.tokenData.tokenPrice,
          convertFromUlps(asset.tokenData.balanceUlps, asset.tokenData.balanceDecimals),
        ]),
        ENumberInputFormat.DECIMAL,
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
  etoModuleApi.selectors.selectEtos,
  selectHomeScreenState,
  (
    balances,
    totalBalanceInEur,
    portfolioAssets,
    neuBalance,
    neuBalanceEur,
    totalPortfolioBalanceEur,
    etos,
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
          etos: nonNullable(etos),
          totalPortfolioBalanceEur,
          screenState,
        };

      default:
        assertNever(screenState, `Invalid screen state received`);
    }
  },
);

export { selectHomeScreenData };
