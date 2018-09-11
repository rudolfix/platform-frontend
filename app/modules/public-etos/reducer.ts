import BigNumber from "bignumber.js";

import {
  TPartialCompanyEtoData,
  TPartialEtoSpecData,
  TPublicEtoData,
} from "../../lib/api/eto/EtoApi.interfaces";
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

export interface IPublicEtoState {
  // only preview, endpoint eto-listing/eto-previews
  previewEtoData?: TPartialEtoSpecData;
  previewCompanyData?: TPartialCompanyEtoData;

  // for endpoint eto-listing/etos
  publicEtos: { [etoId: string]: TPublicEtoData | undefined };
  currentPublicEtoId?: string;
  calculatedContributions: { [etoId: string]: ICalculatedContribution };
  displayOrder: string[];
}

export const etoFlowInitialState: IPublicEtoState = {
  publicEtos: {},
  calculatedContributions: {},
  displayOrder: [],
};

export const publicEtosReducer: AppReducer<IPublicEtoState> = (
  state = etoFlowInitialState,
  action,
): DeepReadonly<IPublicEtoState> => {
  switch (action.type) {
    case "PUBLIC_ETOS_SET_PUBLIC_ETOS":
      return {
        ...state,
        publicEtos: {
          ...state.publicEtos,
          ...action.payload.etos,
        },
      };
    case "PUBLIC_ETOS_SET_DISPLAY_ORDER":
      return {
        ...state,
        displayOrder: action.payload.order,
      };
    case "PUBLIC_ETOS_SET_CURRENT_ETO":
      return {
        ...state,
        currentPublicEtoId: action.payload.etoId,
      };
    case "PUBLIC_ETOS_SET_CALCULATED_CONTRIBUTION":
      return {
        ...state,
        calculatedContributions: {
          ...state.calculatedContributions,
          [action.payload.etoId]: action.payload.contrib,
        },
      };
    case "PUBLIC_ETOS_SET_PREVIEW_ETO":
      const data = action.payload.data;
      return {
        ...state,
        previewEtoData: data && data.eto,
        previewCompanyData: data && data.company,
      };
  }

  return state;
};
