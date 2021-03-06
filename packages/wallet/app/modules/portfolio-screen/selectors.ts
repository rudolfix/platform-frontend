import { investorPortfolioModuleApi, walletApi } from "@neufund/shared-modules";
import {
  addBigNumbers,
  assertNever,
  convertFromUlps,
  ECurrency,
  multiplyBigNumbers,
  nonNullable,
  toEquityTokenSymbol,
  createToken,
  ENumberInputFormat,
} from "@neufund/shared-utils";
import { createSelector } from "reselect";

import { EScreenState } from "modules/types";

import { TPortfolioScreenModuleState, TAsset } from "./types";

const selectPortfolioScreenState = (state: TPortfolioScreenModuleState) =>
  state.portfolioScreen.screenState;

const selectNeuBalance = createSelector(walletApi.selectors.selectNeuBalance, neuBalance =>
  createToken(ECurrency.NEU, neuBalance, ENumberInputFormat.ULPS),
);

const selectNeuBalanceEur = createSelector(
  walletApi.selectors.selectNeuBalanceEuroAmount,
  neuBalance => createToken(ECurrency.EUR, neuBalance, ENumberInputFormat.ULPS),
);

const selectTotalBalanceEur = createSelector(
  investorPortfolioModuleApi.selectors.selectMyAssetsEurEquivTotalWithNeu,
  investorPortfolioModuleApi.selectors.selectMyPendingAssetsInvestedTotal,
  (myAssetsTotalEur = "0", myPendingAssetsTotalEEur = "0") =>
    createToken(
      ECurrency.EUR,
      addBigNumbers([myAssetsTotalEur, myPendingAssetsTotalEEur]),
      ENumberInputFormat.DECIMAL,
    ),
);

const selectPendingAssets = createSelector(
  investorPortfolioModuleApi.selectors.selectMyPendingAssets,
  assets =>
    assets?.map(asset => ({
      id: asset.etoId,
      token: createToken(
        toEquityTokenSymbol(asset.equityTokenSymbol),
        asset.investorTicket.equityTokenInt,
        ENumberInputFormat.DECIMAL,
      ),
      analogToken: createToken(
        ECurrency.EUR,
        asset.investorTicket.equivEur,
        ENumberInputFormat.DECIMAL,
      ),
      tokenImage: asset.equityTokenImage,
      tokenName: asset.equityTokenName,
    })),
);

const selectAssets = createSelector(
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

const selectPortfolioScreenData = createSelector(
  selectAssets,
  selectPendingAssets,
  selectNeuBalance,
  selectNeuBalanceEur,
  selectTotalBalanceEur,
  selectPortfolioScreenState,
  (assets, pendingAssets, neuBalance, neuBalanceEur, totalBalanceEur, screenState) => {
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
          assets: nonNullable(assets),
          pendingAssets: nonNullable(pendingAssets),
          neuBalance,
          neuBalanceEur,
          totalBalanceEur,
          screenState,
        };

      default:
        assertNever(screenState, `Invalid view state received`);
    }
  },
);

export { selectPortfolioScreenData };
