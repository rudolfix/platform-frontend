import BigNumber from "bignumber.js";

import { TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { ICalculatedContribution, IPublicEtoState } from "./reducer";

export const selectEtoById = (state: IPublicEtoState, etoId: string) => state.publicEtos[etoId];

export const selectCalculatedContributionByEtoId = (etoId: string, state: IPublicEtoState) =>
  state.calculatedContributions[etoId];

export const selectEquityTokenCountByEtoId = (etoId: string, state: IPublicEtoState) => {
  const contrib = selectCalculatedContributionByEtoId(etoId, state);
  return contrib && contrib.equityTokenInt.toString();
};

export const selectNeuRewardUlpsByEtoId = (etoId: string, state: IPublicEtoState) => {
  const contrib = selectCalculatedContributionByEtoId(etoId, state);
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
