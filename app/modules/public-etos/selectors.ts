import { createSelector } from "reselect";
import { IAppState } from "../../store";
import { IPublicEtoState } from "./reducer";
import { IEtoFullData } from "./types";

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

export const selectEtoFullData = (state: IPublicEtoState, etoId: string): IEtoFullData | undefined => {
  const eto = state.publicEtos[etoId];

  if (eto) {
    return {
      ...eto,
      contract: state.contracts[etoId]
    };
  }

  return undefined;
};

export const selectPublicEtos = createSelector(
  selectPublicEtosState,
  (state: IPublicEtoState): Array<IEtoFullData> =>
    state.displayOrder.map(id => selectEtoFullData(state, id)!).filter(Boolean),
);
