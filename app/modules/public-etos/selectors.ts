import { createSelector } from "reselect";
import { IAppState } from "../../store";
import { IPublicEtoState } from "./reducer";
import { TEtoWithContract } from "./types";

const selectPublicEtosState = (state: IAppState) => state.publicEtos;

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

export const selectEtoWithContract = (state: IAppState, etoId: string): TEtoWithContract | undefined => {
  const publicEtosState = selectPublicEtosState(state);
  const eto = publicEtosState.publicEtos[etoId];

  if (eto) {
    return {
      ...eto,
      contract: publicEtosState.contracts[etoId]
    };
  }

  return undefined;
};

export const selectPublicEtos = (state: IAppState): Array<TEtoWithContract> => {
  const publicEtosState = selectPublicEtosState(state);

  return publicEtosState.displayOrder.map(id => selectEtoWithContract(state, id)!).filter(Boolean);
};
