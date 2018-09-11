import BigNumber from "bignumber.js";

import { TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { ICalculatedContribution, IPublicEtoState } from "./reducer";

export const selectCurrentEto = (state: IPublicEtoState) =>
  state.currentPublicEtoId ? state.publicEtos[state.currentPublicEtoId] : undefined;

export const selectCurrentCalculatedContribution = (state: IPublicEtoState) =>
  state.currentPublicEtoId ? state.calculatedContributions[state.currentPublicEtoId] : undefined;

export const selectCurrentEquityTokenCount = (state: IPublicEtoState) => {
  const contrib = selectCurrentCalculatedContribution(state);
  return contrib && contrib.equityTokenInt.toString();
};

export const selectCurrentNeuRewardUlps = (state: IPublicEtoState) => {
  const contrib = selectCurrentCalculatedContribution(state);
  return contrib && contrib.neuRewardUlps.toString();
};

export const selectPublicEtoList = (state: IPublicEtoState): TPublicEtoData[] =>
  state.displayOrder.map(id => state.publicEtos[id] as TPublicEtoData).filter(v => v);

// Helpers

export const convertToCalculatedContribution = ([
  isWhitelisted,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
]: [boolean, BigNumber, BigNumber, BigNumber, BigNumber, boolean]): ICalculatedContribution => ({
  isWhitelisted,
  minTicketEurUlps,
  maxTicketEurUlps,
  equityTokenInt,
  neuRewardUlps,
  maxCapExceeded,
});
