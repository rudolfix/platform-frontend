import BigNumber from "bignumber.js";

import { TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { ICalculatedContribution, IPublicEtoState } from "./reducer";

export const selectEtoById = (state: IPublicEtoState, etoId: string) => state.publicEtos[etoId];

export const selectCalculatedContributionByEtoId = (state: IPublicEtoState, etoId: string) =>
  state.calculatedContributions[etoId];

export const selectEquityTokenCountByEtoId = (state: IPublicEtoState, etoId: string) => {
  const contrib = selectCalculatedContributionByEtoId(state, etoId);
  return contrib && contrib.equityTokenInt.toString();
};

export const selectNeuRewardUlpsByEtoId = (state: IPublicEtoState, etoId: string) => {
  const contrib = selectCalculatedContributionByEtoId(state, etoId);
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
