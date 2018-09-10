import BigNumber from "bignumber.js";

import { TPartialCompanyEtoData, TPartialEtoSpecData, TPublicEtoData } from "../../lib/api/eto/EtoApi.interfaces";
import { AppReducer } from "../../store";
import { DeepReadonly } from "../../types";

export interface ICalculatedContribution {
  isWhitelisted: boolean;
  minTicketEurUlps: BigNumber;
  maxTicketEurUlps: BigNumber;
  equityTokenInt: BigNumber;
  neuRewardUlps: BigNumber;
  maxCapExceeded: boolean;
}

export interface IEtoState {
  etos: { [etoId: string]: TPublicEtoData | undefined };
  currentEtoId?: string
  computedContributions: {[etoId: string]: ICalculatedContribution},
  displayOrder: string[]
}

export const etoFlowInitialState: IEtoState = {
  etos: {},
  computedContributions: {},
  displayOrder: []
};

export const etoReducer: AppReducer<IEtoState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IEtoState> => {
  switch (action.type) {
    case "PUBLIC_ETOS_SET_ETOS":
      return {
        ...state,
        previewEtoData: {
          ...state.previewEtoData,
          [action.payload.previewCode]: action.payload.data.etoData,
        },
      };
  }

  return state;
};
