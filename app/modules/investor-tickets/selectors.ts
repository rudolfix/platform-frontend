import BigNumber from "bignumber.js";

import { Q18 } from "../../config/constants";
import { getShareAndTokenPrice } from "../../lib/api/eto/EtoUtils";
import { IAppState } from "../../store";
import { selectPublicEtoById, selectPublicEtos } from "../public-etos/selectors";
import { EETOStateOnChain } from "../public-etos/types";
import { isOnChain } from "../public-etos/utils";
import { selectLockedWalletConnected } from "../wallet/selectors";
import { ICalculatedContribution, TETOWithInvestorTicket } from "./types";

const selectInvestorTicketsState = (state: IAppState) => state.investorTickets;

export const selectInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.investorEtoTickets[etoId];
};

export const selectHasInvestorTicket = (state: IAppState, etoId: string) => {
  const investorState = selectInvestorTicketsState(state);

  const investmentTicket = investorState.investorEtoTickets[etoId];

  if (investmentTicket) {
    // equivEurUlps is set to zero when investor didn't invest
    return !investmentTicket.equivEurUlps.isZero();
  }

  return false;
};

export const selectEtoWithInvestorTickets = (
  state: IAppState,
): TETOWithInvestorTicket[] | undefined => {
  const etos = selectPublicEtos(state);

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

export const selectMyAssets = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);

  if (etos) {
    return etos.filter(eto => eto.investorTicket.claimedOrRefunded);
  }

  return undefined;
};

export const selectMyPendingAssets = (state: IAppState): TETOWithInvestorTicket[] | undefined => {
  const etos = selectEtoWithInvestorTickets(state);

  if (etos) {
    return etos.filter(eto => !eto.investorTicket.claimedOrRefunded);
  }

  return undefined;
};

export const selectCalculatedContribution = (etoId: string, state: IAppState) => {
  const investorState = selectInvestorTicketsState(state);

  return (
    investorState.calculatedContributions[etoId] ||
    selectInitialCalculatedContribution(etoId, state)
  );
};

export const selectInitialCalculatedContribution = (
  etoId: string,
  state: IAppState,
): ICalculatedContribution | undefined => {
  const investorState = selectInvestorTicketsState(state);

  return investorState.initialCalculatedContributions[etoId];
};

export const selectInitialMaxCapExceeded = (etoId: string, state: IAppState): boolean => {
  const initialCalculatedContribution = selectInitialCalculatedContribution(etoId, state);

  if (!initialCalculatedContribution) return false;

  return initialCalculatedContribution.maxCapExceeded;
};

export const selectEquityTokenCountByEtoId = (etoId: string, state: IAppState) => {
  const contrib = selectCalculatedContribution(etoId, state);
  return contrib && contrib.equityTokenInt.toString();
};

export const selectCalculatedEtoTicketSizesUlpsById = (etoId: string, state: IAppState) => {
  const eto = selectPublicEtoById(state, etoId);
  const contrib = selectCalculatedContribution(etoId, state);
  const investorTicket = selectInvestorTicket(state, etoId);

  let min = (contrib && contrib.minTicketEurUlps) || (eto && Q18.mul(eto.minTicketEur || 0));
  let max =
    (contrib && contrib.maxTicketEurUlps) ||
    (eto && eto.maxTicketEur && Q18.mul(eto.maxTicketEur || 0));

  if (min && max) {
    if (eto && investorTicket) {
      const { tokenPrice } = getShareAndTokenPrice(eto);
      min = BigNumber.max(min.sub(investorTicket.equivEurUlps), Q18.mul(tokenPrice.toString()));
      max = BigNumber.max(max.sub(investorTicket.equivEurUlps), 0);
    }

    return {
      minTicketEurUlps: min,
      maxTicketEurUlps: max,
    };
  }
};

export const selectNeuRewardUlpsByEtoId = (etoId: string, state: IAppState) => {
  const contrib = selectCalculatedContribution(etoId, state);
  return contrib && contrib.neuRewardUlps.toString();
};

export const selectIsWhitelisted = (etoId: string, state: IAppState) => {
  const contrib = selectCalculatedContribution(etoId, state);
  return !!contrib && contrib.isWhitelisted;
};

export const selectIsEligibleToPreEto = (etoId: string, state: IAppState) => {
  const isLockedWalletConnected = selectLockedWalletConnected(state);
  const isWhitelisted = selectIsWhitelisted(etoId, state);
  return isLockedWalletConnected || isWhitelisted;
};
