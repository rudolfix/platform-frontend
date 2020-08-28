import {
  addBigNumbers,
  compareBigNumbers,
  convertFromUlps,
  convertToUlps,
  ECurrency,
  isZero,
  multiplyBigNumbers,
  subtractBigNumbers,
} from "@neufund/shared-utils";
import BigNumber from "bignumber.js";
import isArray from "lodash/fp/isArray";
import { createSelector } from "reselect";

import { bookbuildingModuleApi } from "../bookbuilding/module";
import { etoModuleApi, TEtoSpecsData } from "../eto/module";
import {
  selectEtoById,
  selectEtoOnChainStateById,
  selectEtos,
  selectEtoWithCompanyAndContractById,
  selectTokenData,
} from "../eto/selectors";
import { EETOStateOnChain, TEtoWithCompanyAndContractReadonly } from "../eto/types";
import { isOnChain } from "../eto/utils";
import { tokenPriceModuleApi } from "../token-price/module";
import { walletApi } from "../wallet/module";
import { MIMIMUM_RETAIL_TICKET_EUR_ULPS } from "./constants";
import { TInvestorPortfolioModuleState } from "./module";
import {
  ICalculatedContribution,
  IInvestorTicket,
  ITokenDisbursal,
  TETOWithInvestorTicket,
  TETOWithTokenData,
  TTokensPersonalDiscount,
} from "./types";
import { getRequiredIncomingAmount, shouldShowToken } from "./utils";

const selectInvestorTicketsState = (state: TInvestorPortfolioModuleState) =>
  state.investorPortfolio;

export const selectInvestorTicket = (
  state: TInvestorPortfolioModuleState,
  etoId: string,
): IInvestorTicket | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.investorEtoTickets[etoId];
};

export const selectHasInvestorTicket = (state: TInvestorPortfolioModuleState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  const investmentTicket = investorState.investorEtoTickets[etoId];

  if (investmentTicket) {
    // equivEurUlps is set to zero when investor didn't invest
    return !new BigNumber(investmentTicket.equivEur).isZero();
  }

  return false;
};

export const selectEtoWithInvestorTickets = (
  state: TInvestorPortfolioModuleState,
): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtos(state);
  if (etos) {
    return etos
      .filter(isOnChain)
      .filter(eto => eto.contract.timedState !== EETOStateOnChain.Setup)
      .filter(eto => selectHasInvestorTicket(state, eto.etoId))
      .map(eto => ({
        ...eto,
        investorTicket: selectInvestorTicket(state, eto.etoId)!,
      }));
  }

  return undefined;
};

export const selectMyAssets = (
  state: TInvestorPortfolioModuleState,
): TEtoWithCompanyAndContractReadonly[] | undefined => {
  const etos = selectEtos(state);

  if (etos) {
    return etos
      .filter(isOnChain)
      .filter(eto =>
        [EETOStateOnChain.Payout, EETOStateOnChain.Claim].includes(eto.contract.timedState),
      );
  }

  return undefined;
};

export const selectMyPendingAssets = (
  state: TInvestorPortfolioModuleState,
): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);
  if (etos) {
    return etos.filter(eto => !eto.investorTicket.claimedOrRefunded);
  }

  return undefined;
};

export const selectMyPendingAssetsInvestedTotal = createSelector(selectMyPendingAssets, myAssets =>
  myAssets
    ? addBigNumbers(myAssets.map(({ investorTicket }) => investorTicket.equivEur))
    : undefined,
);

export const selectMyPendingAssetsRewardTotal = createSelector(selectMyPendingAssets, myAssets =>
  myAssets
    ? addBigNumbers(myAssets.map(({ investorTicket }) => investorTicket.rewardNmkUlps.toString()))
    : undefined,
);

export const selectMyInvestorTicketByEtoId = (
  state: TInvestorPortfolioModuleState,
  etoId: string,
): TETOWithInvestorTicket | undefined => {
  const eto = selectEtoWithCompanyAndContractById(state, etoId);
  const investorTicket = selectInvestorTicket(state, etoId);

  if (investorTicket && eto) {
    return { ...eto, investorTicket };
  }

  return undefined;
};

export const selectCalculatedContribution = (
  state: TInvestorPortfolioModuleState,
  etoId: string,
) => {
  const investorState = selectInvestorTicketsState(state);

  return (
    investorState.calculatedContributions[etoId] ||
    selectInitialCalculatedContribution(state, etoId)
  );
};

export const selectInitialCalculatedContribution = (
  state: TInvestorPortfolioModuleState,
  etoId: string,
): ICalculatedContribution | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.initialCalculatedContributions[etoId];
};

export const selectInitialMaxCapExceeded = (
  state: TInvestorPortfolioModuleState,
  etoId: string,
): boolean => {
  const initialCalculatedContribution = selectInitialCalculatedContribution(state, etoId);

  if (!initialCalculatedContribution) return false;

  return initialCalculatedContribution.maxCapExceeded;
};

export const selectEquityTokenCountByEtoId = (
  state: TInvestorPortfolioModuleState,
  etoId: string,
) => {
  const contrib = selectCalculatedContribution(state, etoId);
  return contrib && contrib.equityTokenInt.toString();
};

export const selectCalculatedEtoTicketSizesUlpsById = (
  state: TInvestorPortfolioModuleState,
  etoId: string,
) => {
  const eto = selectEtoById(state, etoId);
  const contrib = selectCalculatedContribution(state, etoId);
  const investorTicket = selectInvestorTicket(state, etoId);
  const zero = new BigNumber("0");

  // todo: check if contrib is ever undefined and simplify this condition
  let min =
    (contrib && new BigNumber(contrib.minTicketEurUlps)) ||
    (eto && new BigNumber(convertToUlps(eto.minTicketEur.toString() || zero).toString()));
  let max =
    (contrib && new BigNumber(contrib.maxTicketEurUlps)) ||
    (eto &&
      eto.maxTicketEur &&
      new BigNumber(convertToUlps(eto.maxTicketEur.toString() || zero).toString()));

  if (min && max) {
    if (eto && investorTicket) {
      const equivEurUlps = convertToUlps(investorTicket.equivEur).toString();

      // todo: replace with price taken from smart contract
      const tokenPrice = eto.investmentCalculatedValues!.sharePrice / eto.equityTokensPerShare;
      max = BigNumber.max(max.sub(equivEurUlps), "0");
      // when already invested, you can invest less than minimum ticket however we set this value
      // to more than just one token: we have official retail min ticket at 10 EUR so use it
      min = BigNumber.max(
        min.sub(equivEurUlps),
        convertToUlps(tokenPrice.toString()).toString(),
        MIMIMUM_RETAIL_TICKET_EUR_ULPS,
      );
      // however it cannot be more than max
      min = BigNumber.min(max, min);
    }

    return {
      minTicketEurUlps: min,
      maxTicketEurUlps: max,
    };
  }

  return undefined;
};

export const selectNeuRewardUlpsByEtoId = (state: TInvestorPortfolioModuleState, etoId: string) => {
  const contrib = selectCalculatedContribution(state, etoId);
  return contrib && contrib.neuRewardUlps.toString();
};

export const selectIsWhitelisted = (state: TInvestorPortfolioModuleState, etoId: string) => {
  const contrib = selectInitialCalculatedContribution(state, etoId);

  return !!contrib && contrib.isWhitelisted;
};

export const selectIsEligibleToPreEto = (state: TInvestorPortfolioModuleState, etoId: string) => {
  const isLockedWalletConnected = walletApi.selectors.selectLockedWalletConnected(state);
  // pre-sale eligibility depends on bookbuilding participation which will eventually be committed to smart contract
  const isOnBookbuildingWhitelist =
    bookbuildingModuleApi.selectors.selectMyPledge(state, etoId) !== undefined;

  return isLockedWalletConnected || isOnBookbuildingWhitelist;
};

export const selectShouldShowWhitelistDiscount = (
  state: TInvestorPortfolioModuleState,
  eto: TEtoSpecsData,
) => {
  const isPreEto =
    (selectEtoOnChainStateById(state, eto.etoId) || EETOStateOnChain.Setup) <=
    EETOStateOnChain.Whitelist;
  const isEligibleToPreEto = selectIsEligibleToPreEto(state, eto.etoId);
  return Boolean(eto.whitelistDiscountFraction && isEligibleToPreEto && isPreEto);
};

export const selectShouldShowPublicDiscount = (
  state: TInvestorPortfolioModuleState,
  eto: TEtoSpecsData,
) => Boolean(!selectShouldShowWhitelistDiscount(state, eto) && eto.publicDiscountFraction);

export const selectTokensDisbursalIsLoading = (state: TInvestorPortfolioModuleState) =>
  state.investorPortfolio.tokensDisbursal.loading;

export const selectTokensDisbursalNotInitialized = (state: TInvestorPortfolioModuleState) =>
  state.investorPortfolio.tokensDisbursal.data === undefined;

export const selectTokensDisbursalError = (state: TInvestorPortfolioModuleState) =>
  state.investorPortfolio.tokensDisbursal.error;

/**
 * Selects tokens disbursal with `amountToBeClaimed` greater than zero
 */
export const selectTokensDisbursal = createSelector(
  selectInvestorTicketsState,
  investorPortfolio => {
    if (isArray(investorPortfolio.tokensDisbursal.data)) {
      return investorPortfolio.tokensDisbursal.data
        .filter((d: ITokenDisbursal) => !isZero(d.amountToBeClaimed))
        .filter((t: ITokenDisbursal) => shouldShowToken(t.token, t.totalDisbursedAmount));
    }
    return investorPortfolio.tokensDisbursal.data;
  },
);

export const selectTokensDisbursalEurEquivTotal = createSelector(
  selectTokensDisbursal,
  tokensDisbursal => {
    if (tokensDisbursal) {
      return addBigNumbers([...tokensDisbursal].map(t => t.amountEquivEur));
    }

    return undefined;
  },
);

export const selectTokensDisbursalEurEquivTotalDisbursed = createSelector(
  selectTokensDisbursal,
  tokenPriceModuleApi.selectors.selectEtherPriceEur,
  (tokensDisbursal, etherPriceEur) => {
    if (tokensDisbursal) {
      return convertFromUlps(
        addBigNumbers(
          [...tokensDisbursal].map(t =>
            t.token === ECurrency.ETH
              ? multiplyBigNumbers([t.totalDisbursedAmount, etherPriceEur])
              : t.totalDisbursedAmount,
          ),
        ),
      ).toString();
    }

    return undefined;
  },
);

export const selectPayoutAvailable = (state: TInvestorPortfolioModuleState) => {
  const tokenDisbursal = selectTokensDisbursal(state);
  return !!tokenDisbursal && tokenDisbursal.length > 0;
};

export const selectMyAssetsWithTokenData = (
  state: TInvestorPortfolioModuleState,
): TETOWithTokenData[] | undefined => {
  const myAssets = selectMyAssets(state);

  if (myAssets) {
    return myAssets.flatMap((asset: TEtoWithCompanyAndContractReadonly) => {
      const tokenData = selectTokenData(state.eto, asset.previewCode);

      if (tokenData) {
        return [
          {
            ...asset,
            tokenData,
          },
        ];
      }

      return [];
    });
  }

  return undefined;
};

export const selectMyAssetsEurEquivTotal = createSelector(selectMyAssetsWithTokenData, myAssets => {
  if (myAssets && myAssets.length > 0) {
    return myAssets
      .map(asset => asset.tokenData)
      .reduce(
        (myAssetsEurEquivTotal, tokenData) =>
          addBigNumbers([
            myAssetsEurEquivTotal,
            multiplyBigNumbers([
              convertFromUlps(tokenData.balanceUlps, tokenData.balanceDecimals),
              tokenData.tokenPrice,
            ]),
          ]),
        "0",
      );
  }

  return undefined;
});

export const selectMyAssetsEurEquivTotalWithNeu = createSelector(
  selectMyAssetsEurEquivTotal,
  walletApi.selectors.selectNeuBalanceEurEquiv,
  (myAssetsEurEquivTotal = "0", neuValue = "0") => addBigNumbers([myAssetsEurEquivTotal, neuValue]),
);

export const selectIsIncomingPayoutLoading = (state: TInvestorPortfolioModuleState): boolean =>
  state.investorPortfolio.incomingPayouts.loading;

export const selectIsIncomingPayoutNotInitialized = (
  state: TInvestorPortfolioModuleState,
): boolean => state.investorPortfolio.incomingPayouts.data === undefined;

export const selectIncomingPayoutError = (state: TInvestorPortfolioModuleState): boolean =>
  state.investorPortfolio.incomingPayouts.error;

export const selectEtherTokenIncomingPayout = (state: TInvestorPortfolioModuleState): string => {
  const incomingPayout = state.investorPortfolio.incomingPayouts.data;

  if (incomingPayout) {
    const minimumEtherTokenAmount = getRequiredIncomingAmount(ECurrency.ETH);
    const etherToken = incomingPayout.etherTokenIncomingPayoutValue;

    return compareBigNumbers(etherToken, minimumEtherTokenAmount) >= 0 ? etherToken : "0";
  }
  return "0";
};

export const selectEuroTokenIncomingPayout = (state: TInvestorPortfolioModuleState): string => {
  const incomingPayout = state.investorPortfolio.incomingPayouts.data;

  if (incomingPayout) {
    const minimumEuroTokenAmount = getRequiredIncomingAmount(ECurrency.EUR_TOKEN);
    const euroToken = incomingPayout.euroTokenIncomingPayoutValue;

    return compareBigNumbers(euroToken, minimumEuroTokenAmount) >= 0 ? euroToken : "0";
  }
  return "0";
};

export const selectIncomingPayoutSnapshotDate = (
  state: TInvestorPortfolioModuleState,
): number | undefined => {
  const incomingPayout = state.investorPortfolio.incomingPayouts.data;
  return incomingPayout && incomingPayout.snapshotDate;
};

export const selectIsIncomingPayoutPending = (state: TInvestorPortfolioModuleState): boolean => {
  const etherToken = selectEtherTokenIncomingPayout(state);
  const euroToken = selectEuroTokenIncomingPayout(state);

  const minimumEtherTokenAmount = getRequiredIncomingAmount(ECurrency.ETH);
  const minimumEuroTokenAmount = getRequiredIncomingAmount(ECurrency.EUR_TOKEN);

  // Incoming payout is more or equals 1ETH
  const shouldShowEtherToken = compareBigNumbers(etherToken, minimumEtherTokenAmount) >= 0;
  // Incoming payout is more or equals 100nEUR
  const shouldShowEuroToken = compareBigNumbers(euroToken, minimumEuroTokenAmount) >= 0;

  return shouldShowEtherToken || shouldShowEuroToken;
};

export const selectIncomingPayoutEurEquiv = createSelector(
  selectEtherTokenIncomingPayout,
  selectEuroTokenIncomingPayout,
  tokenPriceModuleApi.selectors.selectEtherPriceEur,
  (etherTokenIncomingPayout, euroTokenIncomingPayout, etherPriceEur) =>
    convertFromUlps(
      addBigNumbers([
        euroTokenIncomingPayout,
        multiplyBigNumbers([etherTokenIncomingPayout, etherPriceEur]),
      ]).toString(),
    ).toString(),
);

export const selectPastInvestments = (
  state: TInvestorPortfolioModuleState,
): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);
  if (etos) {
    return etos
      .filter(eto => eto.investorTicket.claimedOrRefunded)
      .filter(eto => etoModuleApi.utils.isPastInvestment(eto.contract!.timedState))
      .sort((left, right) => {
        const timedStateLeft = left.contract!.timedState;
        const timedStateRight = right.contract!.timedState;

        const investmentDateLeft = new Date(
          left.contract!.startOfStates[timedStateLeft]!,
        ).getTime();
        const investmentDateRight = new Date(
          left.contract!.startOfStates[timedStateRight]!,
        ).getTime();

        // sort by date DESC
        return investmentDateRight - investmentDateLeft;
      });
  }

  return undefined;
};

export const selectTokenPersonalDiscount = (
  state: TInvestorPortfolioModuleState,
  etoId: string,
): TTokensPersonalDiscount | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.tokensPersonalDiscounts[etoId];
};

export const selectPersonalDiscount = createSelector(
  selectInvestorTicket,
  selectTokenPersonalDiscount,
  (investorTicket, tokenPersonalDiscount) => {
    if (investorTicket && tokenPersonalDiscount) {
      const whitelistDiscountAmountLeft = subtractBigNumbers([
        tokenPersonalDiscount.whitelistDiscountAmountEur,
        investorTicket.equivEur.toString(),
      ]);

      return {
        whitelistDiscountAmountLeft,
        discountedTokenPrice: tokenPersonalDiscount.discountedTokenPrice,
        whitelistDiscount: tokenPersonalDiscount.whitelistDiscount,
      };
    }

    return undefined;
  },
);
